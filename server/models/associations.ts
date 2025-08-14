import { setupLoanerCarAssociations } from './loaner-car.model';
import { setupLoanAssociations } from './loan.model';

export function setupAllAssociations() {
    setupLoanerCarAssociations();
    setupLoanAssociations();
} 