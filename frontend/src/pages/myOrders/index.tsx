"use client"

import { motion } from "framer-motion"
import { Package, Car, User, CreditCard, FileText, Calendar, Truck, ArrowLeft, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ErrorService } from "@/services/error.service"
import { ServiceErrorCode } from "@/services/service.result"
import OrderService from "@/services/order.service"
import { IOrderExtended } from "@/models/order.model"
import { DeleteOrderDialog } from "@/components/dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import jsPDF from 'jspdf'

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrderExtended[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrderExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchAccount, setSearchAccount] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  
  const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<IOrderExtended | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await OrderService.getAllOrders();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setOrders(result.result || []);
          setFilteredOrders(result.result || []);
          console.log("Logins récupérés:", result.result);
        } else {
          setOrders([]);
          setFilteredOrders([]);
          ErrorService.errorMessage("Erreur", "Impossible de récupérer les comptes de connexion");
        }
      } catch (error) {
        console.error("Exception lors de la récupération des logins:", error);
        ErrorService.errorMessage("Erreur", "Impossible de récupérer les comptes de connexion");
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchAccount.trim()) {
      filtered = filtered.filter(order =>
        order.login?.loginName?.toLowerCase().includes(searchAccount.toLowerCase())
      );
    }

    if (searchClient.trim()) {
      filtered = filtered.filter(order =>
        order.customer?.firstName?.toLowerCase().includes(searchClient.toLowerCase()) ||
        order.customer?.lastName?.toLowerCase().includes(searchClient.toLowerCase())
      );
    }

    if (searchDate.trim()) {
      const searchDateObj = new Date(searchDate);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.creationDate);
        return orderDate.toDateString() === searchDateObj.toDateString();
      });
    }

    if (searchPlate.trim()) {
      const cleanSearchPlate = searchPlate.replace(/-/g, '').toLowerCase();
      filtered = filtered.filter(order => {
        const cleanOrderPlate = order.registration?.registrationName?.replace(/-/g, '').toLowerCase() || '';
        return cleanOrderPlate.includes(cleanSearchPlate);
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchAccount, searchClient, searchDate, searchPlate]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const orderDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = orderDateOnly.getTime() - nowDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })}`;
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTotalItems = (orderDetails: any[] | undefined) => {
    return orderDetails?.reduce((total, detail) => total + detail.quantity, 0) || 0;
  };

  const getTimeIndicator = (dateString: string | Date) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    
    const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = orderDateOnly.getTime() - nowDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return { text: "Prochainement", color: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/30" };
    } else if (diffDays === 0) {
      return { text: "Aujourd'hui", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30" };
    } else if (diffDays === -1) {
      return { text: "Hier", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30" };
    } else if (diffDays >= -7) {
      return { text: "Cette semaine", color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" };
    } else if (diffDays >= -30) {
      return { text: "Ce mois", color: "text-orange-400", bgColor: "bg-orange-500/20", borderColor: "border-orange-500/30" };
    } else {
      return { text: "Ancienne", color: "text-gray-400", bgColor: "bg-gray-500/20", borderColor: "border-gray-500/30" };
    }
  };

  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const generateOrderPDF = (order: IOrderExtended) => {
    const doc = new jsPDF();
    
    const primaryColor = [44, 62, 80];
    const secondaryColor = [52, 73, 94];
    const accentColor = [231, 76, 60];
    const darkColor = [26, 32, 44];
    const textColor = [44, 62, 80];

    const addNewPage = () => {
      doc.addPage();
      return 20;
    };

    const checkPageBreak = (currentY: number, requiredSpace: number) => {
      const pageHeight = doc.internal.pageSize.height;
      if (currentY + requiredSpace > pageHeight - 30) {
        return addNewPage();
      }
      return currentY;
    };

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("RÉCAPITULATIF DE COMMANDE", 105, 18, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Commande N° ${order.id}`, 105, 28, { align: 'center' });
    
    let yPosition = 45;
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Date de création:", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(order.creationDate), 70, yPosition);
    
    yPosition += 15;
    
    yPosition = checkPageBreak(yPosition, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("INFORMATIONS GÉNÉRALES", 20, yPosition);
    
    yPosition += 10;
    
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.3);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    doc.setFont('helvetica', 'bold');
    doc.text("Compte:", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.login?.loginName || "Non spécifié", 70, yPosition);
    
    yPosition += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Client:", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Non spécifié", 70, yPosition);
    
    yPosition += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Fournisseur:", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.supplier?.supplierName || "Non spécifié", 70, yPosition);
    
    yPosition += 20;
    
    yPosition = checkPageBreak(yPosition, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("VÉHICULE", 20, yPosition);
    
    yPosition += 10;
    
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    doc.setFont('helvetica', 'bold');
    doc.text("Marque & Modèle:", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.carBrand?.brandName && order.carModel?.modelName ? `${order.carBrand.brandName} ${order.carModel.modelName}` : "Non spécifié", 70, yPosition);
    
    yPosition += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Plaque:", 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(order.registration?.registrationName || "Non spécifiée", 70, yPosition);
    
    yPosition += 20;
    
    yPosition = checkPageBreak(yPosition, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("PIÈCES COMMANDÉES", 20, yPosition);
    
    yPosition += 10;
    
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    
    if (order.orderDetails && order.orderDetails.length > 0) {
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(20, yPosition, 120, 8, 'F');
      doc.rect(150, yPosition, 40, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("DESCRIPTION", 25, yPosition + 6);
      doc.text("QUANTITÉ", 155, yPosition + 6);
      
      let tableY = yPosition + 12;
      order.orderDetails.forEach((detail, index) => {
        tableY = checkPageBreak(tableY, 10);
        
        if (tableY === 20) {
          doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.rect(20, tableY, 120, 8, 'F');
          doc.rect(150, tableY, 40, 8, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text("DESCRIPTION", 25, tableY + 6);
          doc.text("QUANTITÉ", 155, tableY + 6);
          
          tableY += 12;
        }
        
        const rowColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
        doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
        doc.rect(20, tableY, 120, 8, 'F');
        doc.rect(150, tableY, 40, 8, 'F');
        
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        const itemName = detail.item?.itemName || `Pièce ${detail.itemId}`;
        const truncatedName = itemName.length > 30 ? itemName.substring(0, 27) + '...' : itemName;
        doc.text(truncatedName, 25, tableY + 6);
        doc.text(detail.quantity.toString(), 155, tableY + 6);
        
        tableY += 8;
      });
      
      yPosition = tableY + 10;
    } else {
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text("Aucun détail disponible", 20, yPosition);
      yPosition += 20;
    }
    
    yPosition = checkPageBreak(yPosition, 35);
    yPosition += 15;
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("TOTAL:", 20, yPosition);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`${getTotalItems(order.orderDetails)} pièces`, 42, yPosition);
    
    yPosition += 25;
    
    const footerText = "Document généré automatiquement par CarLev";
    const footerY = doc.internal.pageSize.height - 15;
    const footerX = doc.internal.pageSize.width / 2;
    
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(footerText, footerX, footerY, { align: 'center' });
    
    doc.save(`Commande_${order.id}_${formatDate(order.creationDate).replace(/\//g, '-')}.pdf`);
    
    ErrorService.successMessage("Succès", "Récapitulatif de commande téléchargé !");
  };

  
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Mes Commandes</h1>
                <p className="text-gray-400">Consultez l'historique de vos commandes</p>
              </div>
            </div>
            
            <Button
              onClick={() => router.push("/newOrder")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              Nouvelle Commande
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Filtres de recherche</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchAccount" className="text-gray-300 text-sm">Compte</Label>
                    <Input
                      id="searchAccount"
                      placeholder="Rechercher par compte..."
                      value={searchAccount}
                      onChange={(e) => setSearchAccount(e.target.value)}
                      className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="searchClient" className="text-gray-300 text-sm">Client</Label>
                    <Input
                      id="searchClient"
                      placeholder="Rechercher par client..."
                      value={searchClient}
                      onChange={(e) => setSearchClient(e.target.value)}
                      className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="searchDate" className="text-gray-300 text-sm">Date</Label>
                    <Input
                      id="searchDate"
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="searchPlate" className="text-gray-300 text-sm">Plaque</Label>
                    <Input
                      id="searchPlate"
                      placeholder="Rechercher par plaque..."
                      value={searchPlate}
                      onChange={(e) => setSearchPlate(e.target.value)}
                      className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                {(searchAccount || searchClient || searchDate || searchPlate) && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchAccount("");
                        setSearchClient("");
                        setSearchDate("");
                        setSearchPlate("");
                      }}
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-gray-400 mt-4">Chargement des commandes...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    {orders.length === 0 ? "Aucune commande" : "Aucune commande trouvée"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {orders.length === 0 
                      ? "Vous n'avez pas encore passé de commande"
                      : "Aucune commande ne correspond à vos critères de recherche"
                    }
                  </p>
                  {orders.length === 0 ? (
                    <Button
                      onClick={() => router.push("/newOrder")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Passer votre première commande
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchAccount("");
                        setSearchClient("");
                        setSearchDate("");
                        setSearchPlate("");
                      }}
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              currentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardHeader className="border-b border-gray-700 px-6 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                            <Package className="w-7 h-7 text-blue-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <CardTitle className="text-2xl text-white font-bold">
                                Commande #{order.id}
                              </CardTitle>
                              {(() => {
                                const timeIndicator = getTimeIndicator(order.creationDate);
                                return (
                                  <div className={`px-2 py-1 rounded-md text-xs font-medium border ${timeIndicator.bgColor} ${timeIndicator.borderColor} ${timeIndicator.color}`}>
                                    {timeIndicator.text}
                                  </div>
                                );
                              })()}
                            </div>
                            <CardDescription className="text-gray-300 text-base">
                              Commandée le {formatDate(order.creationDate)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Total pièces</div>
                          <div className="text-3xl font-bold text-blue-400">
                            {getTotalItems(order.orderDetails)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.orderDetails?.length || 0} article(s)
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <div className="bg-gray-700/30 rounded-lg p-4">
                              <h4 className="text-base font-bold text-white mb-3 flex items-center border-b border-gray-600/50 pb-2">
                                <User className="w-4 h-4 mr-2 text-blue-400" />
                                Informations du Compte
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-gray-500">Compte utilisé</div>
                                  <div className="text-white font-medium">
                                    {order.login?.loginName || "Non spécifié"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Client</div>
                                  <div className="text-white font-medium">
                                    {order.customer ? 
                                      `${order.customer.firstName} ${order.customer.lastName}` : 
                                      "Non spécifié"
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-gray-700/30 rounded-lg p-4">
                              <h4 className="text-base font-bold text-white mb-3 flex items-center border-b border-gray-600/50 pb-2">
                                <Car className="w-4 h-4 mr-2 text-purple-400" />
                                Véhicule
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-gray-500">Marque & Modèle</div>
                                  <div className="text-white font-medium">
                                    {order.carBrand?.brandName && order.carModel?.modelName ? 
                                      `${order.carBrand.brandName} ${order.carModel.modelName}` : 
                                      "Non spécifié"
                                    }
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Plaque</div>
                                  <div className="text-white font-medium">
                                    {order.registration?.registrationName || "Non spécifiée"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-gray-700/30 rounded-lg p-4">
                              <h4 className="text-base font-bold text-white mb-3 flex items-center border-b border-gray-600/50 pb-2">
                                <Truck className="w-4 h-4 mr-2 text-orange-400" />
                                Fournisseur
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-gray-500">Nom</div>
                                  <div className="text-white font-medium">
                                    {order.supplier?.supplierName || "Non spécifié"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Date commande</div>
                                  <div className="text-white font-medium text-sm">
                                    {formatDate(order.creationDate)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h4 className="text-base font-bold text-white mb-4 flex items-center border-b border-gray-600/50 pb-2">
                            <Package className="w-4 h-4 mr-2 text-blue-400" />
                            Pièces commandées ({getTotalItems(order.orderDetails)} au total)
                          </h4>
                          
                          {order.orderDetails && order.orderDetails.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {order.orderDetails.map((detail, detailIndex) => (
                                <div
                                  key={detail.id || detailIndex}
                                  className="bg-gray-600/50 rounded-lg p-3 border border-gray-600/30"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <span className="text-white font-medium text-sm">
                                        {detail.item?.itemName || `Pièce ${detail.itemId}`}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gray-400 text-xs">Qté:</span>
                                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                                        {detail.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm italic text-center py-4">
                              Aucun détail de pièce disponible
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <div className="border-t border-gray-700 px-6 py-4">
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateOrderPDF(order)}
                          className="border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOrderToDelete(order);
                            setIsDeleteOrderDialogOpen(true);
                          }}
                          className="border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer la commande
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
            
            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                {/* Bouton Première Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Première
                </Button>
                
                {/* Bouton Page Précédente */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédente
                </Button>
                
                {/* Numéros de Pages */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNumber)}
                          className={
                            currentPage === pageNumber
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                {/* Bouton Page Suivante */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivante
                </Button>
                
                {/* Bouton Dernière Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Dernière
                </Button>
              </div>
            )}
            
            {/* Informations de pagination */}
            {filteredOrders.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-400">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredOrders.length)} sur {filteredOrders.length} commandes
                {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
              </div>
            )}
          </motion.div>
        </main>
      </div>
      
      <DeleteOrderDialog
        isOpen={isDeleteOrderDialogOpen}
        onClose={() => {
          setIsDeleteOrderDialogOpen(false);
          setOrderToDelete(null);
        }}
        onOrderDeleted={() => {
          const loadOrders = async () => {
            try {
              const result = await OrderService.getAllOrders();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setOrders(result.result || []);
                setFilteredOrders(result.result || []);
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des commandes:", error);
            }
          };
          loadOrders();
        }}
        order={orderToDelete}
      />
    </AuthGuard>
  )
} 