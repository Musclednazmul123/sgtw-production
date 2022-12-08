import { TitleBar } from "@shopify/app-bridge-react";
import { Banner, Button, Card, FormLayout, Heading, Label, Layout, List, Page, RadioButton, Select, Stack, TextContainer, TextField, TextStyle } from "@shopify/polaris";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Axios from "../Axios";
import store from "store2";
import { InstallationScriptCss, InstallationScriptJS, InstallationScriptLiquid } from "../components/InstallationScript";

var image_src = "https://crp.shfqtechnologies.com/images/config.png";

export default function Configuration() {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [installationLoading, setInstallationLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shopify_os2, setShopifyOS2] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    Axios.get("/themes/all.json?shop="+store("shop")).then(response => {
      if(response && response.data && response.data.themes){
        setThemes(response.data.themes);
      }
      setPageLoading(false);
    }).catch(error => {
      setError("Unable to fetch all themes");
      setPageLoading(false);
    });
  }, []);
  if (pageLoading) {
    return <LoadingSkeleton></LoadingSkeleton>
  }

  const runSetup = () => {
    if(selectedTheme){
      setInstallationLoading(true);
      Axios.post("/themes/install.json?shop="+store("shop")+"&theme_id="+selectedTheme.replace("idx","")).then(response => {
        if(response && response.data && response.data.success === true){
          setSuccess(true);
        }
        else{
          setShopifyOS2(true);
          setError("Setup could not be completed. Please contact us at support@shfqtechnologies");
        }
        setInstallationLoading(false);
      }).catch(error => {
        setShopifyOS2(true);
        setError("Setup could not be completed. Please contact us at support@shfqtechnologies");
        setInstallationLoading(false);
      });
    }
    else{
      setError("Please select a theme to config the application");
    }
  }

  const removeSetup = () => {
    if(selectedTheme){
      setInstallationLoading(true);
      Axios.post("/themes/uninstall.json?shop="+store("shop")+"&theme_id="+selectedTheme.replace("idx","")).then(response => {
        if(response && response.data && response.data.success === true){
          setSuccess(true);
        }
        else{
          setError("Setup could not be completed. Please contact us at support@shfqtechnologies");
        }
        setInstallationLoading(false);
      }).catch(error => {
        setError("Setup could not be completed. Please contact us at support@shfqtechnologies");
        setInstallationLoading(false);
      });
    }
    else{
      setError("Please select a theme to config the application");
    }
  }

  return (
    <Page>
      <TitleBar
        title="Configuration"
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack vertical spacing="extraTight">
              <Label>Select Theme OS version</Label>
              <RadioButton
                label="Shopify OS 2.0"
                id="shopify_2.0"
                checked={shopify_os2===true}
                onChange={() => {
                  setShopifyOS2(true);
                }}
              ></RadioButton>
              <RadioButton
                label="Shopify OS 1"
                id="shopify_1.0"
                checked={shopify_os2===false}
                onChange={() => {
                  setShopifyOS2(false);
                }}
              ></RadioButton>
              <TextStyle variation="subdued">If you are not sure about Shopify OS version. Please contact us. We will configure this app for you. Email us now <TextStyle variation="code">support@shfqtechnologies.com</TextStyle> Or call at <TextStyle variation="code">+1 (760) 309 4222</TextStyle></TextStyle>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
      {
        shopify_os2===false&& <Layout>
          {
            success && <Layout.Section>
              <Banner status="success" title="Configuration has been successfuully completed"></Banner>
            </Layout.Section>
          }
          <Layout.Section>
            <Banner status="warning" title="Do not auto install on shopify OS 2.0">
              <p>Shopify OS 2.0 configuration does not need any code to be injected into your theme. Auto installation support is only for old themes. But this method is not 100% accurate. So we recommend you to contact us so we can configure app on your theme.  </p>
            </Banner>
          </Layout.Section>
          <Layout.Section>
            <Card title="1: Auto configuration (Recommended)">
              <Card.Section>
                <Banner status="info" title="Duplicate your theme before auto installation">
                  <p>We recommend you should not run this on your Live Theme. Take a backup and install on duplicated theme to avoid any breakage in the theme.</p>
                </Banner>
              </Card.Section>
              <Card.Section>
                <FormLayout>
                  <FormLayout.Group>
                    <Select
                      label="Select a theme"
                      value={selectedTheme}
                      onChange={(theme) => {setSelectedTheme(theme)}}
                      options={themes.map(theme => {
                        return {
                          label: theme.name,
                          value: "idx"+theme.id
                        }
                      })}
                    ></Select>
                    <div></div>
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <Stack spacing="loose" alignment="center">
                    <Button
                        disabled={!selectedTheme}
                        loading={installationLoading}
                        primary
                        onClick={()=>{
                          runSetup();
                        }}
                      >
                        Install setup
                      </Button>
                      {/* <Button
                        disabled={!selectedTheme}
                        loading={installationLoading}
                        destructive
                        onClick={()=>{
                          removeSetup();
                        }}
                      >
                        Uninstall
                      </Button> */}
                      {
                        installationLoading && <div>
                          <TextStyle variation="strong">
                            We are setting up configuration for your theme. Please wait... 
                          </TextStyle>
                        </div>
                      }
                    </Stack>
                  </FormLayout.Group>
                </FormLayout>
              </Card.Section>
            </Card>
            <Card title="2: Manual configuration">
              <Card.Section>
                <Stack vertical spacing="loose">
                  <Banner status="warning" title="This action requires technical skills">
                    <p>If you know programming (coding), you can easily configure this app. Meanwhile if you don't have coding skills, please feel free to contact us at support@shfqtechnologies.com</p>
                  </Banner>
                </Stack>
              </Card.Section>
              <Card.Section title="Step 1">
                <List type="number">
                  <List.Item>
                    This code should be installed in <TextStyle variation="code">product.liquid</TextStyle> template.
                  </List.Item>
                  <List.Item>
                    Feel free to change its location inside <TextStyle variation="code">product.liquid</TextStyle>
                  </List.Item>
                </List>
              </Card.Section>
              <Card.Section title="Step 2">
                <FormLayout>
                  <TextField
                    label="custom-related-products.css"
                    value={InstallationScriptCss}
                    helpText="File Name: assets/custom-related-products.css"
                    readOnly
                    id="script-text-css"
                    onFocus={() => {
                      copyCode("script-text-css");
                    }}
                  />
                  <TextField
                    label="custom-related-products.js"
                    value={InstallationScriptJS}
                    helpText="File Name: assets/custom-related-products.js"
                    readOnly
                    id="script-text-js"
                    onFocus={() => {
                      copyCode("script-text-js");
                    }}
                  />
                  <TextField
                    label="custom-related-products.liquid"
                    value={InstallationScriptLiquid}
                    helpText="File Name: sections/custom-related-products.liquid"
                    readOnly
                    id="script-text-liquid"
                    onFocus={() => {
                      copyCode("script-text-liquid");
                    }}
                  />
                </FormLayout>
              </Card.Section>
            </Card>
            <Card title="3: Contact us">
              <Card.Section>
                <TextContainer spacing="loose">
                  <Heading>We are always here to help you whenever you need our support</Heading>
                  <p>
                    Free free to contact us at <TextStyle variation="code">support@shfqtechnologies.com</TextStyle>
                  </p>
                </TextContainer>
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <TextStyle variation="warning">
              Note. It is recommended you use uninstall button to remove app assets, before you uninstall the app from the store.
            </TextStyle>
          </Layout.Section>
          <Layout.Section>
          </Layout.Section>
        </Layout>
      }
      {
        shopify_os2===true && 
        <Layout>
          <Layout.Section>
          <Heading>Please follow these steps to config app</Heading>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <div className="crp-image-config">
                <img src={image_src} alt="Config theme instructions" width={"100%"}></img>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      }
    </Page>
  );
}

function copyCode(id) {
  var copyText = document.getElementById(id);
  try {
    copyText.select();
  } catch (e) {
    console.error(e);
  }
}