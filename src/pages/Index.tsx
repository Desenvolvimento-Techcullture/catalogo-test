import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCardHighlight from "@/components/ProductCardHighlight";
// import heroBanner from "@/assets/hero-banner.jpg";
import { BannerCarousel } from "@/components/BannerCarousel";
import { useProduct } from "@/contexts/ProductContext";
import { banners } from "@/assets/data.js";
import CategoriesSection from "@/components/CategoriesSection";
import CreatableSelect from "react-select/creatable";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Letreiro from "@/components/Letreiro";



const Index = () => {
  // const prods = JSON.parse(localStorage.getItem("products")) ?? products;

  const { products, categories, loading, error } = useProduct();

  const featuredProducts = products.filter(item => item.highlight);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex p-2 gap-2 flex landscape:hidden bg-bege">
                {banners[0].buttons?.map((btn, idx) => (
                  <Button key={`${btn.description}-${idx}`} size="default" variant={btn.variant} asChild>
                   
                    <Link to={btn.link} target="__blank"> { btn.description.includes('WhatsApp') && (<WhatsAppIcon />)} {btn.description}</Link>
                  </Button>
                )

                )}

                {/* <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Entre em Contato</Link>
                </Button> */}
              </div>
      <main className="flex-1">
        {/* Hero Section */}
        {(banners.length == 1) && (<section className="relative aspect-[6/3] w-full landscape:h-[70vh] landscape:min-h-[300px] overflow-hidden bg-secondary">
          <div className="absolute inset-0">
            <img
              src={banners[0].image}
              alt="Banner principal"
              // className=" w-full object-contain md:object-cover"
              className=" h-full md:w-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" /> */}
          </div>

          <div className="relative container mx-auto px-4 h-full flex items-end pb-8 md:pb-0  md:items-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                {banners[0].title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light whitespace-pre-line">
                {banners[0].description}
              </p>
              <div className="flex gap-4">
                {/* {banners[0].buttons?.map((btn, idx) => (
                  <Button key={`${btn.description}-${idx}`} size="lg" variant={btn.variant} asChild>
                    <Link to={btn.link}>{btn.description}</Link>
                  </Button>
                )

                )} */}

                {/* <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Entre em Contato</Link>
                </Button> */}
              </div>
            </div>
          </div>
        </section>)}
        {(banners.length > 1) && (<BannerCarousel />)}
        <div className="">

          <Letreiro 
          velocidade={30} 
          altura={50} 
          estilo="bg-primary-gradient text-white"
          texto="• Compre no varejo com preço de atacado;• Frete grátis* ;• A loja que viabiliza seu sonho" 
          
          />
        </div>
        <CategoriesSection 
          title="title"
          subtitle="subtitle"
          categories={categories}
          className="bg-primary  text-white"
          linkClassName="  px-4 py-2 rounded-full text-sm border text-blue-700  border-blue-700 transition hover:bg-white/20 text-center whitespace-nowrap"
        />
        {/* Featured Products Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-primary font-light tracking-tight mb-4">
                Produtos em Destaque
              </h2>
              <p className="text-lg text-muted-foreground">
                Seleção especial das peças mais procuradas
              </p>
            </div>
            <div className="flex justify-items-center">

              {/* <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${featuredProducts.length} gap-6 mx-auto min-w-3xl max-w-4xl`}> */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto max-w-3xl justify-items-center"> */}
              <div
                className="
                          grid
                          gap-6
                          mx-auto
                          max-w-7xl
                          justify-center
                          sm:grid-cols-[repeat(auto-fit,minmax(110px,1fr))]
                          md:grid-cols-[repeat(auto-fit,minmax(110px,290px))]
                        "
              >

                {featuredProducts.map((product) => (
                  <ProductCardHighlight
                    key={product.id}
                    id={String(product.id)}
                    image={product.images[0]}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    original_price={product.original_price}
                    max_installments={product.max_installments}
                    quantity={product.quantity}
                    category={product.category}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link to="/products">Ver Todos os Produtos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-primary-gradient opacity-90 text-white hidden md:block">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Categorias
              </h2>
              <p className="text-lg ">
                Explore nossa seleção por categoria
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories
              .map((category) => (
                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  // className="group relative aspect-square rounded-lg overflow-hidden shadow-elegant hover:shadow-hover transition-smooth"
                  className="px-4 py-2 rounded-full text-sm border transition  hover:bg-white/20 text-center justify-center"

                >
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" /> */}
                  {/* <div className="absolute inset-0 flex items-center justify-center"> */}
                  {/* <h3 className="text-xl md:text-2xl font-light text-primary-foreground"> */}
                  {category}
                  {/* </h3> */}
                  {/* </div> */}
                </Link>
                //   <button
                //   key={category}

                //   className=
                //     "px-4 py-2 rounded-full text-sm border transition bg-muted text-muted-foreground hover:bg-accent/10"

                // >
                //   {category}
                // </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
