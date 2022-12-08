import { Button, Card, FormLayout, Layout, Page, TextField, Banner } from "@shopify/polaris";
import { useState } from "react";
import {
    SendMajor
  } from '@shopify/polaris-icons';
import { TitleBar } from "@shopify/app-bridge-react";
import Axios from  "../Axios";
import store from "store2";

export default function Support() {
    const [success_banner, setBanner] = useState(false);
    const [error_banner, setErrorBanner] = useState(false);
    const [loading, setLoading] = useState(false);
  const [store_name, setStore] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [url, setURL] = useState("https://"+(store("shop") || "myshop.com")+"/products/test");
  const [password, setPassword] = useState("");
  const send_btn_disabled = !email || !subject || !message;
  return (
    <Page>
        <TitleBar
            title="Support"
        />
      <Layout>
        {
            !error_banner && success_banner && <Layout.Section><Banner status="success" title="Thank you for contacting us we will get back to you shortly"></Banner></Layout.Section>
        }
        {
            error_banner && <Layout.Section><Banner status="critical" title="Server error."></Banner></Layout.Section>
        }
          <Layout.AnnotatedSection
            title="Support"
            description="Use this form to report a bug, request a new feature or to just say hello. If you are facing some technical issues please check out Configuration page."
          >
            <Card>
                <Card.Section>
                    <FormLayout>
                        <TextField
                            disabled
                            label="Store URL"
                            value={store("shop")}
                            onChange={(v) => {}}
                        />
                        <TextField
                            requiredIndicator
                            label="Contact email"
                            value={email}
                            onChange={(v) => {setEmail(v)}}
                        />
                        <TextField
                            requiredIndicator
                            label="Subject (Reason)"
                            value={subject}
                            onChange={(v) => {setSubject(v)}}
                        />
                        <TextField
                            requiredIndicator
                            multiline={5}
                            label="Description"
                            placeholder="I am experiencing a problem"
                            value={message}
                            onChange={(v) => {setMessage(v)}}
                        />
                        <FormLayout.Group>
                            <TextField
                                label="Product URL (Optional)"
                                value={url}
                                onChange={(v) => {setURL(v)}}
                            />
                        </FormLayout.Group>
                        <FormLayout.Group>
                            <TextField
                                label="Storefront Password (Optional)"
                                value={password}
                                placeholder="Enter passowrd"
                                onChange={(v) => {setPassword(v)}}
                            />
                            <div></div>
                        </FormLayout.Group>
                        <Button
                            disabled={send_btn_disabled}
                            loading={loading}
                            icon={SendMajor}
                            primary
                            onClick={() => {
                                setLoading(true);
                                Axios.post("/contact/create.json?shop="+(store("shop")), {
                                    shop: store("shop"),
                                    data: {
                                        store_name,
                                        email,
                                        subject,
                                        message,
                                        password,url
                                    }
                                }).then(response => {
                                    setBanner(true);
                                    setLoading(false);
                                    setEmail(""); setSubject(""); setMessage(""); setPassword("");
                                }).catch(error => {
                                    setErrorBanner(true);
                                    setLoading(false);
                                })
                            }}
                        >
                            Send
                        </Button>
                    </FormLayout>
                </Card.Section>
            </Card>
          </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}