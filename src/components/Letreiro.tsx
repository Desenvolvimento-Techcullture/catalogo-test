export default function Letreiro({
    texto,
    velocidade = 1, // quanto menor, mais rápido
    altura = 50,
    repeticoes = 3,
  }) {
    // const textos = Array(repeticoes).fill(texto);
    const textos = texto.split(';');
    
  
    return (
      <div
        className="w-full letreiro text- overflow-hidden flex items-center bg-primary-gradient text-white"
        style={{ height: `${altura}px` }}
      >
        <style>
          {`
            @keyframes marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
  
            .marquee {
              animation: marquee ${velocidade}s linear infinite;
            }
  
            .marquee:hover {
              animation-play-state: paused;
            }
          `}
        </style>
  
        <div className="flex w-max marquee">
          {/* bloco original */}
          <div className="flex whitespace-nowrap">
            {textos.map((t, i) => (
              <span
                key={`a-${i}`}
                className="mx-8 font-light text-lg  text-base sm:text-lg md:text-xl "
              >
                {t}
              </span>
            ))}
          </div>
  
          {/* clone */}
          <div className="flex whitespace-nowrap">
            {textos.map((t, i) => (
              <span
                key={`b-${i}`}
                className="mx-8 font-light text-lg  text-base sm:text-lg md:text-xl"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  