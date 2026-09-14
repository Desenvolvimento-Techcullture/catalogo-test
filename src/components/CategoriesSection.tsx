import React from "react";
import { Link } from "react-router-dom";

/**
 * Componente de Seção de Categorias
 *
 * @param {Object} props
 * @param {string} props.title - Título da seção
 * @param {string} props.subtitle - Subtítulo da seção
 * @param {Array<string>} props.categories - Lista de categorias
 * @param {string} [props.sectionClassName] - Classes adicionais para a seção
 * @param {string} [props.linkClassName] - Classes adicionais para os links
 * @param {string} [props.className] - Classes adicionais para o componente
 * @param {boolean} [props.wrapCategories=false] - Permite quebra de linha nas categorias
 */
const CategoriesSection = ({
  title = "Categorias",
  subtitle = "Explore nossa seleção por categoria",
  categories = [],
  sectionClassName = "py-2 bg-white text-primary",
  linkClassName = "px-4 py-2 rounded-full text-sm border transition hover:bg-white/20 text-center whitespace-nowrap",
  className = "",
  wrapCategories = false,
}) => {
  return (
    <section className={`${sectionClassName} ${className}`}>
      <div className="container mx-auto px-4">
        <div
          className={
            wrapCategories
              ? "flex flex-wrap gap-2 pb-2 justify-center"
              : "flex gap-4 overflow-x-auto pb-2"
          }
        >
          {[...categories]
            .sort((a, b) => a.localeCompare(b))
            .map((category) => (
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
