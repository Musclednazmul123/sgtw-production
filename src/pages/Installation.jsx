import { Page, Layout, Card, Stack, Heading, Badge, MediaCard, VideoThumbnail, Select, Button, Form, FormLayout } from "@shopify/polaris";
import { TitleBar, useAppBridge, useNavigationHistory } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { Axios } from "../Axios";
import store from "store2";
export default function Installation() {const app = useAppBridge();
    const redirect = Redirect.create(app);
    const [selected, setSelected] = useState('');
    const [theme, setTheme] = useState([]);
    const handleThemeChange = useCallback((theme) => setSelected(theme), []);
    const {replace} = useNavigationHistory();
    const navigate = useNavigate();
    useEffect(() => {
        themes();
    }, []);

    function themes(){
        Axios({
            type: "get",
            url: "/themes/all.json",
            headers: {
                'Content-Type': 'application/json'
            },   
        }, function(error, response){
            if (response && response.themes && response.themes.length > 0) {
                setSelected("theme_"+response.themes[0].id);
                try {
                    var themes_names = response.themes.map((theme) => {
                        var label = theme.name;
                        if (theme.role === "main") {
                            label += " (LIVE)"
                        }
                        return {
                            label: label,
                            value: "theme_"+theme.id
                        }
                    });
                    setTheme(themes_names);
                } catch (error) {}
            }
        });
    }

    return(
        <Page>
        <TitleBar
        breadcrumbs={[{
            content: "Dashboard",
            onAction: () => {
                navigate("/home");
                replace({pathname: '/home'});
            }
        }]} 
        title="Installations"
        secondaryActions={[
        {
            content: "Dashboard",
            onAction: () => {
            navigate("/home", {replace: true});
            replace({pathname: '/home'});
            }
        },
        ]}
        />
            <Layout>
                <Layout.Section>
                        <Card>
                            <Card.Section>
                                <Stack vertical>
                                    <Heading>Installation</Heading>
                                    <Heading>Select a theme to add Muscled Upsell {'&'} Order Boost</Heading>
                                    <Form>
                                        <FormLayout>
                                            <FormLayout.Group>
                                                <Select label="Theme" value={selected} options={theme} onChange={handleThemeChange} />
                                                <div></div>
                                                <div></div>
                                                <Heading>Instructions <Badge status="success">Online Store 2.0</Badge>
                                                </Heading>  
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </Form>
                                    <Button
                                        disabled={!selected}
                                        primary 
                                        onClick={() => {
                                            redirect.dispatch(Redirect.Action.REMOTE,{
                                                url: "https://"+(store("shop"))+"/admin/themes/"+(selected?selected.replace("theme_",""):"")+"/editor?template=product&context=apps&activateAppId=79ec3b02-70fb-49f6-a70f-a6b21c30d3e2/upsell-app-block",
                                                newContext: true
                                            })
                                        }}
                                    >Preview in theme</Button>
                                </Stack>
                            </Card.Section>
                        </Card>
                        <Card>
                            <MediaCard title="Add reviews to your product templates" description={`Watch this tutorial on how to add product reviews to your product templates in a few simple steps.`}>
                                <VideoThumbnail videoLength={80} thumbnailUrl="https://www.youtube.com/embed/rjLkWcm8-yc" />
                            </MediaCard>
                        </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}