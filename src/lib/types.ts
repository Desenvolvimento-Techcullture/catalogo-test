export interface Product {
    id: number;
    images: string[];
    name: string;
    price: number;
    original_price?: number | null;
    reseller_price?: number | null;
    max_installments?: number | null;
    category: string;
    description: string;
    quantity: number;
    sizes: string[];
    highlight?: boolean | null;

}


export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
  }

export interface ProductForm {
    name: string;
    price: string;
    original_price: string;
    reseller_price?: string;
    max_installments?: string;
    quantity: string;
    category: string;
    images: string[];
    description: string;
    sizes: string;
    highlight: boolean;
}

export interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    cpf?: string;
    password: string;
    role?: 'admin' | 'user' | 'seller' | 'developer';
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface OrderCustomer {
    id: number;
    name: string;
    phone: string;
    email: string;
    document: string;
    documentType: 'cpf' | 'cnpj';
    deliveryMethod: string;
    cep: string;
    address: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    shippingCity: string;
    paymentMethod: string;
    observations: string;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, phone: string, password: string, role?: string ) => Promise<boolean>;
    logout: () => void;
}
// Tipos auxiliares
export type DocumentType = 'cpf' | 'cnpj';

export type PaymentMethod = 'Pix' | 'Cartão' | 'Boleto' | 'Dinheiro';

export type ShippingMethod = 'A combinar' | 'Correios' | 'Retirada';

// Entidades principais
export interface Order {
    id: number;
    customer: Customer;
    items: OrderItem[];
    shipping: Shipping;
    paymentMethod: PaymentMethod;
    observations?: string;
    subtotal: number; // em centavos
    total: number;    // em centavos
    date: Date;
    seller?: string;
}

export interface Customer {
    name: string;
    phone: string;
    email: string;
    document: string;
    documentType: DocumentType;
}

export interface OrderItem {
    id: number;
    name: string;
    price: number;   // em centavos
    quantity: number;
}

export interface Shipping {
    method: ShippingMethod;
    cost: number; // em centavos

    cep?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
}
