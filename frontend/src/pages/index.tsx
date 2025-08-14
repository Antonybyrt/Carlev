"use client"

import { motion } from "framer-motion"
import { Package, Users, Car, TrendingUp, BarChart3, PieChart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ErrorService } from "@/services/error.service"
import { ServiceErrorCode } from "@/services/service.result"
import OrderService from "@/services/order.service"
import LoanerCarService from "@/services/loaner-car.service"
import LoanService from "@/services/loan.service"
import { IOrderExtended } from "@/models/order.model"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

export default function HomePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrderExtended[]>([]);
  const [ordersByAccount, setOrdersByAccount] = useState<any[]>([]);
  const [totalAvailableLoanerCars, setTotalAvailableLoanerCars] = useState<number>(0);
  const [totalLoanedCars, setTotalLoanedCars] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      try {

        const ordersResult = await OrderService.getAllOrders();
        if (ordersResult && ordersResult.errorCode === ServiceErrorCode.success) {
          setOrders(ordersResult.result || []);
        }

        try {
          const loanerCarsResult = await LoanerCarService.getAllLoanerCars();
          if (loanerCarsResult && loanerCarsResult.errorCode === ServiceErrorCode.success) {
            const loanerCars = loanerCarsResult.result || [];
            const availableCars = loanerCars.filter(car => car.status === 'DISPONIBLE').length;
            const loanedCars = loanerCars.filter(car => car.status === 'EN_PRET').length;
            setTotalAvailableLoanerCars(availableCars);
            setTotalLoanedCars(loanedCars);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des véhicules de prêt:", error);
        }

      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        ErrorService.errorMessage("Erreur", "Impossible de charger les données du dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map(order => order.customer?.id).filter(Boolean)).size;
  const totalVehicles = new Set(orders.map(order => `${order.carBrand?.id}-${order.carModel?.id}`).filter(Boolean)).size;

  const getAvailableYears = () => {
    const years = new Set<number>();
    orders.forEach(order => {
      const orderDate = new Date(order.creationDate);
      years.add(orderDate.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const getOrdersByMonth = (year: number) => {
    const months = [
      { name: 'Jan', value: 0, month: 0 },
      { name: 'Fév', value: 0, month: 1 },
      { name: 'Mar', value: 0, month: 2 },
      { name: 'Avr', value: 0, month: 3 },
      { name: 'Mai', value: 0, month: 4 },
      { name: 'Juin', value: 0, month: 5 },
      { name: 'Juil', value: 0, month: 6 },
      { name: 'Août', value: 0, month: 7 },
      { name: 'Sep', value: 0, month: 8 },
      { name: 'Oct', value: 0, month: 9 },
      { name: 'Nov', value: 0, month: 10 },
      { name: 'Déc', value: 0, month: 11 }
    ];

    orders.forEach(order => {
      const orderDate = new Date(order.creationDate);
      if (orderDate.getFullYear() === year) {
        months[orderDate.getMonth()].value++;
      }
    });

    return months;
  };

  const getOrdersByAccountData = () => {
    const accountNames = ['LEVON', 'CAL', 'CARLEV'];
    const accountData = accountNames.map(name => {
      const accountOrders = ordersByAccount.find(acc => acc.accountName === name);
      return accountOrders ? accountOrders.orderCount : 0;
    });

    if (ordersByAccount.length === 0) {
      const fallbackData = accountNames.map(name => {
        const count = orders.filter(order => order.login?.loginName === name).length;
        return count;
      });
      return accountNames.map((name, index) => ({
        name,
        value: fallbackData[index],
        color: ['#3B82F6', '#10B981', '#8B5CF6'][index]
      }));
    }

    return accountNames.map((name, index) => ({
      name,
      value: accountData[index],
      color: ['#3B82F6', '#10B981', '#8B5CF6'][index]
    }));
  };

  const monthData = getOrdersByMonth(selectedYear);
  const accountData = getOrdersByAccountData();
  const availableYears = getAvailableYears();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-blue-400">{payload[0].value} commandes</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-blue-400">{data.value} commandes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
            <p className="text-gray-400 text-lg">Vue d'ensemble de votre activité</p>
          </motion.div>

          {/* Cartes de statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Nombre total de commandes */}
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-200">Total Commandes</CardTitle>
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalOrders}</div>
                <p className="text-xs text-gray-400 mt-1">Commandes passées</p>
              </CardContent>
            </Card>

            {/* Nombre total de clients */}
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-200">Total Clients</CardTitle>
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalCustomers}</div>
                <p className="text-xs text-gray-400 mt-1">Clients uniques</p>
              </CardContent>
            </Card>

            {/* Nombre total de véhicules */}
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-200">Total Véhicules de Prêt Disponibles</CardTitle>
                  <Car className="w-6 h-6 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalAvailableLoanerCars}</div>
                <p className="text-xs text-gray-400 mt-1">Véhicules disponibles pour prêt</p>
              </CardContent>
            </Card>

            {/* Nombre total de pièces */}
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-200">Total Véhicules Prétés</CardTitle>
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalLoanedCars}</div>
                <p className="text-xs text-gray-400 mt-1">Véhicules actuellement prétés</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Graphiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Graphique des commandes par mois */}
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>Commandes par mois</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                      Évolution des commandes sur l'année {selectedYear}
                </CardDescription>
                  </div>
                  
                  {/* Sélecteur d'année */}
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year} className="bg-gray-700 text-white">
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickFormatter={(value) => value.toString()}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Graphique des commandes par compte */}
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-green-400" />
                  <span>Commandes par compte</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Répartition des commandes entre les comptes
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={accountData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                        animationBegin={0}
                      >
                        {accountData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="#1F2937"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  {/* Légende personnalisée */}
                  <div className="mt-6 flex flex-wrap justify-center gap-6">
                    {accountData.map((account, index) => (
                      <div key={account.name} className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: account.color }}
                        />
                        <span className="text-sm text-white font-medium">{account.name}</span>
                        <span className="text-sm text-gray-400">({account.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  )
}
