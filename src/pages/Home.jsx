import styled from "styled-components";

export const Page = ({ className }) => {
  return (
    <div className={className}>
      <section>
        <div className="content">
          <div className="text">
            <p className="title">
              Join the Microsoft 365 Developer Program today!
            </p>
            <span>
              Get a new instant sandbox preconfigured with sample data,
              including Teams Developer Portal, and start developing on the
              Microsoft 365 platform.
            </span>
          </div>

          <img src="https://via.placeholder.com/468x300" />
        </div>
      </section>
      <section className="blue">
        <div className="content">Home</div>
      </section>
    </div>
  );
};

export const StyledPage = styled(Page)`
  height: 100%;

  section {
  }

  .content {
    max-width: 980px;
    width: 100%;
    margin: auto;
    align-items: center;
    display: flex;
  }

  .content > .text {
  }

  .content .title {
    font-size: 32px;
    font-weight: bold;
  }

  .blue {
    background-color: #0078d4;
  }

  .content > div {
    flex: 1;
  }
`;
