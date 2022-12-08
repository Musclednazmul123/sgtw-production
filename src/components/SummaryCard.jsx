import { Card, Heading, TextContainer, TextStyle } from "@shopify/polaris";

export default function SummaryCard({title, content}) {
    return (
      <Card sectioned>
        <TextContainer spacing="tight">
          <TextStyle variation="subdued">{title}</TextStyle>
          <Heading>{content}</Heading>
        </TextContainer>
      </Card>
    )
}