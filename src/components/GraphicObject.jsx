import styled from "styled-components";

export const Component = ({ children, className }) => {
  return <g onClick={() => console.log("clicked")}>{children}</g>;
};

export const StyledComponent = styled(Component)`
  position: relative;
`;
