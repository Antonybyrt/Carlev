-- Migration v2.5.0: Modifier le type de end_date pour inclure l'heure
-- Changer le type de end_date de DATE à DATETIME pour permettre l'heure

ALTER TABLE loan MODIFY COLUMN end_date DATETIME NULL;
