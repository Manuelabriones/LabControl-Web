
const AuthIllustration = ({ type = "computer" }) => {
  if (type === "laptop") {
    return (
      <svg viewBox="0 0 300 220" className="auth-illustration">
        <defs>
          <linearGradient id="laptopScreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#526B91" />
            <stop offset="100%" stopColor="#101F3B" />
          </linearGradient>
          <linearGradient id="laptopBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A9B9D0" />
          </linearGradient>
        </defs>

        {/* Pantalla de la laptop */}
        <path
          d="M73 38 Q72 31 80 30 L225 18 Q233 18 234 26 L245 145 L91 159 Z"
          fill="#DDE7F5"
          stroke="#FFFFFF"
          strokeWidth="5"
        />

        <path
          d="M83 40 L224 29 L235 136 L95 149 Z"
          fill="url(#laptopScreen)"
        />

        <circle cx="158" cy="78" r="17" fill="#EAF1FF" />
        <path
          d="M129 125 Q131 93 158 94 Q185 94 188 125 Z"
          fill="#EAF1FF"
        />

        {/* Base */}
        <path
          d="M90 158 L244 145 L277 177 Q280 182 270 185 L112 198 Q103 199 98 192 L66 169 Z"
          fill="url(#laptopBase)"
          stroke="#FFFFFF"
          strokeWidth="3"
        />

        <path
          d="M100 166 L242 154 L260 174 L115 186 Z"
          fill="#7186A7"
          opacity="0.65"
        />

        {/* Teclas */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={111 + col * 13 + row * 1.5}
              y={169 + row * 4}
              width="9"
              height="2.5"
              rx="1"
              fill="#EAF1FF"
            />
          ))
        )}

        {/* Botón de usuario */}
        <circle cx="207" cy="113" r="18" fill="#D7192D" />
        <path
          d="M207 104 V122 M198 113 H216"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 220" className="auth-illustration">
      <defs>
        <linearGradient id="monitorScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#50698E" />
          <stop offset="100%" stopColor="#101E3A" />
        </linearGradient>
        <linearGradient id="monitorBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#A9B9D0" />
        </linearGradient>
      </defs>

      {/* Pantalla */}
      <path
        d="M65 28 L232 10 Q240 10 239 18 L224 145 L48 155 Z"
        fill="#E8F0FA"
        stroke="#FFFFFF"
        strokeWidth="5"
      />

      <path
        d="M75 37 L224 21 L211 135 L59 145 Z"
        fill="url(#monitorScreen)"
      />

      <path
        d="M78 39 L180 29 L65 120 Z"
        fill="#FFFFFF"
        opacity="0.07"
      />

      {/* Base del monitor */}
      <path
        d="M126 150 L166 148 L162 170 L124 172 Z"
        fill="#DCE5F2"
      />
      <path
        d="M105 172 L185 168 L195 178 L94 182 Z"
        fill="url(#monitorBody)"
        stroke="#FFFFFF"
        strokeWidth="2"
      />

      {/* Teclado */}
      <path
        d="M49 181 L197 177 L221 193 L34 199 Z"
        fill="url(#monitorBody)"
        stroke="#FFFFFF"
        strokeWidth="2"
      />

      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={52 + col * 12 + row * 2}
            y={183 + row * 4}
            width="8"
            height="2.5"
            rx="1"
            fill="#7186A7"
          />
        ))
      )}

      {/* Mouse */}
      <ellipse
        cx="242"
        cy="190"
        rx="11"
        ry="7"
        transform="rotate(-20 242 190)"
        fill="#EAF1FA"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    </svg>
  );
};

export default AuthIllustration;
