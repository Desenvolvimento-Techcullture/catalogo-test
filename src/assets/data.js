// import heroBanner from "@/assets/hero-banner.jpg";
// import heroBanner from "@/assets/prod10.png";

// import carroussel1 from '@/assets/banner_site.png';

export const banners = [{
    id: "1",
    image: './banner.png',
    title: "",
    description: "",
    buttons: [
        // { link: "/products", description: "Meus produtos legais", variant: 'outlineDark' },
        // { link: "/products", description: "Contatos legais", variant: 'dark' },
        //     { link: "/products", description: "outras coisas legais legais", variant: 'primary' },
    ]
}];



export const API_BASE_URL = "https://techculture.portaldeanuncios.com/distrimov/api/";
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwic3lzIjoiY2F0YWxvZyIsIm93bmVyIjoidGVjaGN1bHR1cmUiLCJpYXQiOjE3Njk1MjQ5NzksImV4cCI6MTc2OTUyODU3OX0=.jZP+Ek0Ojx5JuF7EOTO2C48Y0BgX76JV2STJ5aku2ec=';

export const company = {
    name: 'DISTRIMOV',
    logo: '/logo.jpg',
    slogan: 'Distrimov atacarejo',
    address: '',
    phone: '+55 (31) 98808-1254',
    email: 'distrimovatacarejo@hotmail.com',
    instagram: 'https://www.instagram.com/distrimov_atacarejo/',
    facebook: 'https://www.facebook.com/p/Distrimov-Atacarejo-61565913566515/',
    whatsapp: 'https://wa.me/31988081254',
    uriTermosCondicoes: '',
    openingHours: 'Segunda a sexta: 8h às 18h',
    twitter: '',
    youtube: '',
}
const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' });

export const navLinks = [
    { path: "/", label: "Início" },
    { path: "/products", label: "Produtos" },
    { path: "/contact", label: "Contato" },
];


// export const sizes = [...new Set(products.map(product => product.size))];

export const theme = {
    primary: "0 0% 15%;",
    secondary: "24 10% 95%",
    accent: "340 65% 75%"
}

export const availableCities = [
    "Belo Horizonte",
    "Contagem",
    "Ribeirão das Neves",
    "Santa Luzia",
    "Vespasiano",
    "Sabará",
    "Esmeralda",
    "Betim",
    "Ibirite",
    "Nova Lima",
    "Pedro Leopoldo",
    "São José da Lapa",
    "Lagoa Santa",
    "Nova Contagem"
];

export const freeCities = [
    "Santa Luzia",
];

export const calculateShipping = (city) => {
    if (!city) return { available: false, cost: 0, days: 1, isFree: false };

    const normalizedCity = city.trim().toLowerCase();
    const normalizedFreeCities = freeCities.map(c => c.toLowerCase());
    const normalizedAvailableCities = availableCities.map(c => c.toLowerCase());

    // if (!normalizedAvailableCities.includes(normalizedCity)) {
    //     return { available: false, cost: 0, days: 1, isFree: false };
    // }

    // if (normalizedCity === "roca") {
    //     return { available: true, cost: 30, days: 1, isFree: false };
    // }

    if (normalizedFreeCities.includes(normalizedCity)) {
        return { available: true, cost: 0, days: 1, isFree: true };
    }

    return { available: true, cost: 100, days: 2, isFree: false };
};