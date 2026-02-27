import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const SellerRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSeller = async () => {
      if (!slug) {
        navigate("/");
        return;
      }

      sessionStorage.setItem('joias-cless-seller',
        slug.split('-')                 // separa pelo hífen
          .map(palavra =>
            palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
          )                            // capitaliza cada parte
          .join(' '));


      navigate("/");
    };

    fetchSeller();
  }, [slug, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
};

export default SellerRedirect;
