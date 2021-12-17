import React from "react";
import GuideCard from "./Card";
import { Container } from "react-bootstrap";

const CardGrid = props => {
  return (
    <Container flex>
      <div class="justify-content-center">
        <div
          class="card-deck d-flex
          justify-content-center"
        >
          <div
            class="row d-flex
              justify-content-center"
          >
            {props.guideData.map(row => (
              <div
                style={{
                  width: "18rem",
                  height: "18rem",
                  marginBottom: ".5rem",
                  marginTop: ".5rem"
                }}
              >
                <GuideCard
                  title={row.title}
                  user={row.user}
                  clicks={row.clicks}
                  id={row.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CardGrid;
