import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ChevronLeft, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useProduct } from "@/contexts/ProductContext";
import { formatPrice } from "@/lib/utils";
import { useCatalogTracking } from "@/hooks/catalogTrnking";
import { ImageCarousel } from "@/components/ImageCarousel";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { products } = useProduct();
  const { trackAddToCart, trackViewProduct} = useCatalogTracking();
  const product = products.find((p) => p.id == id);

   // Rastreia o produto
   useEffect(() => {
    if (product) {
      trackViewProduct(product);
    }
  }, [product]);
  

  const goToPrevious = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setActiveImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Dispositivo Movel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
  
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
  
    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }
  };
  // Fim do dispositivo movel

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-light mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate("/products")}>
              Voltar aos Produtos
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
    
  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) return;
    addToCart(product, selectedSize);
    trackAddToCart(product);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar aos produtos
          </Link>

          <div className="grid md:grid-cols-[1fr_1fr] gap-12">
            {/* Imagem principal */}
            <div className="flex flex-col items-start relative">
              <div
                // className="relative border rounded-lg overflow-hidden w-full h-[500px] cursor-zoom-in"
                className="w-full bg-no-repeat bg-contain"
                // relative border rounded-lg overflow-hidden w-full h-[500px]
                onClick={() => setZoomOpen(true)}
              >
                <img
                  src={product.images[activeImageIndex]}
                  alt={`${product.name} ${activeImageIndex + 1}`}
                  className="h-full w-full object-contain transition-transform duration-300 cursor-zoom-in hover:scale-105"
                />
              </div>

              {/* Miniaturas */}
              {(product.images.length > 1) && <div className="flex gap-2 mt-4">
                {product.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    className={`h-20 w-20 object-cover border rounded cursor-pointer transform transition-transform duration-200 hover:scale-105 ${idx === activeImageIndex ? "border-primary" : "border-gray-300"
                      }`}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl font-light mb-4">{product.name}</h1>
                <p className="text-3xl font-light text-primary">
                  {/* {formatPrice(  product.original_price || product.price)} */}
                  {formatPrice( product.price)}
                </p>
                {product.max_installments && false && (<p className="price-current">  <span className="text-sm text-muted-foreground line"> 10x </span>  {formatPrice(product.original_price / 10)}</p>)}
                {product.original_price && false && (<p className="text-sm text-muted-foreground line">Ou {formatPrice(product.price)} à vista </p>)}

              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Selecione o tamanho:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selecione um tamanho para adicionar ao carrinho
                    </p>
                  )}
                </div>
              )}

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
              >
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Zoom fullscreen */}
        {zoomOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">

            {/* Botão fechar */}
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setZoomOpen(false)}
            >
              <X />
            </button>

           
            {/* Imagem com swipe */}
            <ImageCarousel
              images={product.images}
              initialIndex={activeImageIndex}
              onSlideChange={(index) => setActiveImageIndex(index)}
            />

           
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
