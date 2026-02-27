import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata preço no padrão brasileiro
export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// formata data no formato brasileiro
export const formatDateBR = (dataISO) => {
  return new Date(dataISO).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// normaliza textos para ajudar desconsiderar caracteres especiais
export const normalizeText = (text) =>
text
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");