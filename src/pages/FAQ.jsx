import { TitleBar } from "@shopify/app-bridge-react";
import { Layout, Page } from "@shopify/polaris";
import CollapsibleItem from "../components/CollapsibleItem";
import { FrequentlyAskedQuestions } from "../components/FrequentlyAskedQuestions";

function render_content(){
    return FrequentlyAskedQuestions.map((item, index) => {
        return <Layout.Section>
            <CollapsibleItem
                title={item.title}
                content={item.content}
                embed_video_modal={item.embed_video_modal}
                modal_title={item.modal_title}
                modal_src={item.model_src}
            ></CollapsibleItem>
        </Layout.Section>
    });
}

export default function FAQ() {
    return (
        <Page>
            <TitleBar
                title="Frequently Asked Questions"
            />
            <Layout>
                {render_content()}
            </Layout>
        </Page>
    );
}