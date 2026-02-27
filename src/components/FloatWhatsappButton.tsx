import WhatsAppIcon from "./WhatsAppIcon";

export default function FloatWhatsappButton({url}) {
    return (

        <a  
            href={url}
            target="__blank"
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-2xl shadow-lg md:hidden">
                 <WhatsAppIcon className="flex h-14 w-14"/>
                 </a>
        )

}