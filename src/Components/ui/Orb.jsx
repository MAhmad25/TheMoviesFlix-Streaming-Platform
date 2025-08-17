import styled, { keyframes, css, createGlobalStyle } from "styled-components";

// Global styles to register the CSS @property
const GlobalStyle = createGlobalStyle`
  @property --angle {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }
`;

const rotate = keyframes`
  to {
    --angle: 360deg;
  }
`;

const StyledOrb = styled.div`
      --angle: 0deg;

      display: grid;
      grid-template-areas: "stack";
      inline-size: min(80vmin, 100%);
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: 50%;

      &::before,
      &::after {
            content: "";
            display: block;
            grid-area: stack;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            transform: translateZ(0);
      }

      &::before {
            background: conic-gradient(from calc(var(--angle) * 2) at 25% 70%, ${(props) => props.c3 || "white"}, transparent 20% 80%, ${(props) => props.c3 || "white"}), conic-gradient(from calc(var(--angle) * 2) at 45% 75%, ${(props) => props.c2 || "#C7A931"}, transparent 30% 60%, ${(props) => props.c2 || "#C7A931"}), conic-gradient(from calc(var(--angle) * -3) at 80% 20%, ${(props) => props.c1 || "#3C4331"}, transparent 40% 60%, ${(props) => props.c1 || "#3C4331"}), conic-gradient(from calc(var(--angle) * 2) at 15% 5%, ${(props) => props.c2 || "#C7A931"}, transparent 10% 90%, ${(props) => props.c2 || "#C7A931"}), conic-gradient(from calc(var(--angle) * 1) at 20% 80%, ${(props) => props.c1 || "#3C4331"}, transparent 10% 90%, ${(props) => props.c1 || "#3C4331"}), conic-gradient(from calc(var(--angle) * -2) at 85% 10%, ${(props) => props.c3 || "white"}, transparent 20% 80%, ${(props) => props.c3 || "white"});
            box-shadow: inset ${(props) => props.bg || "oklch(12.9% 0.042 264.695)"} 0 0 5vmin 1vmin;
            filter: blur(3vmin) contrast(5);
            animation: ${rotate} ${(props) => props.duration || "20s"} linear infinite;
            ${(props) =>
                  props.paused &&
                  css`
                        animation-play-state: paused;
                  `}
      }

      &::after {
            --dot: ${(props) => props.dotSize || "1.5px"};
            background-image: radial-gradient(circle at center, ${(props) => props.bg || "oklch(12.9% 0.042 264.695)"} var(--dot), transparent var(--dot));
            background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
            mask-image: radial-gradient(black 25%, transparent 75%);
            backdrop-filter: blur(8vmin) contrast(10);
            mix-blend-mode: overlay;
            ${(props) =>
                  props.hideTexture &&
                  css`
                        display: none;
                  `}
      }
`;

const Orb = ({ c1 = "#3C4331", c2 = "#C7A931", c3 = "white", bg = "oklch(12.9% 0.042 264.695)", duration = "20s", dotSize = "1.5px", paused = false, hideTexture = false, ...props }) => {
      return (
            <>
                  <GlobalStyle />
                  <StyledOrb c1={c1} c2={c2} c3={c3} bg={bg} duration={duration} dotSize={dotSize} paused={paused} hideTexture={hideTexture} {...props} />
            </>
      );
};

export default Orb;
