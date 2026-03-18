import React from "react";
import { Link } from "react-router-dom";
// import { cn } from "@/lib/utils";
/**
 * Componente de Seção de Categorias com rolagem horizontal
 * @param {Object} props
 * @param {string} props.title - Título da seção
 * @param {string} props.subtitle - Subtítulo da seção
 * @param {Array<{name: string, link: string}>} props.categories - Lista de categorias com nome e link
 * @param {string} [props.sectionClassName] - Classes adicionais para a seção
 * @param {string} [props.linkClassName] - Classes adicionais para os links de categoria
 */
const CategoriesSection = ({
  title = "Categorias",
  subtitle = "Explore nossa seleção por categoria",
  categories = [],
  sectionClassName = "py-2 bg-white opacity-90 text-primary",
  linkClassName = "px-4 py-2 rounded-full text-sm border transition hover:bg-white/20 text-center whitespace-nowrap",
  className = "",
}) => {
  return (
    <section className={`${sectionClassName} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className={linkClassName}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;