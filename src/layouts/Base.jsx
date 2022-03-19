import styled from "styled-components";

export const Layout = ({ className, children }) => {
  return (
    <div className={className}>
      <div>
        <nav>Hello</nav>
      </div>
      <main>{children}</main>
    </div>
  );
};

export const StyledLayout = styled(Layout)`
  display: flex;
  flex-direction: column;
  height: 100%;

  main {
    flex: 1;
  }
`;
