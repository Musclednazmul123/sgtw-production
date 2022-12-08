import { Banner, Button, Card, Checkbox, FooterHelp, FormLayout, Icon, Label, Layout, Link, Page, PageActions, RadioButton, Select, Stack, Tag, TextField, TextStyle, Thumbnail } from "@shopify/polaris";
import { CartMajor, CheckoutMajor, DragHandleMinor, MobileCancelMajor, ProductsMajor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {Loading, ResourcePicker, TitleBar} from '@shopify/app-bridge-react';

import product_page_preview from "../assets/product_page_preview.jpg";
import cart_page_preview from "../assets/cart_page_purchase.png";
import checkout_page_preview from "../assets/checkout_page_preview.jpg";
import { Axios } from "../Axios";
import { getID } from "../components/Helper";
import SummaryCard from "../components/SummaryCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import store from "store2";

export default function EditOffer({ method }) {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState("");
    const [clicks, setClicks] = useState("");
    const [conversion, setConversion] = useState("");
    const [conversion_rate, setConversionRate] = useState("");

    const [setup, setSetup] = useState(false);
    const [offer_by, setOfferBy] = useState("products");
    const [offer_trigger_by, setOfferTriggerBy] = useState("products");
    const [matching_products, setProducts] = useState([]);
    const [trigger_products, setTriggerProducts] = useState([]);
    const [randomize, setRandomize] = useState(false);
    const [product_modal_open, setProductModal] = useState(false);
    const [product_modal_open_for_trigger, setProductModalTrigger] = useState(false);
    const handleRandomize = useCallback((randomize) => {setRandomize(randomize)}, [randomize]);
    const handleOfferBy = useCallback((offer_by) => {setOfferBy(offer_by)}, [offer_by]);
    const handleOfferTriggerBy = useCallback((offer_trigger_by) => {setOfferTriggerBy(offer_trigger_by)}, [offer_trigger_by]);
    // const views = useCallback((views) => {setViews(views)}, [views]);
    const navigate = useNavigate();

    const [post, setPost] = useState(null);

    // useEffect(() => {
    //     try {
    //         window.scrollTo({
    //             top: 0,
    //             behavior: "smooth"
    //         });
    //     } catch (e) { }
    //     if (method === "edit") {
    //         Axios({
    //             type: "get",
    //             url: "/merchant/get_offer?id="+id,
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         }, function(error, stats){
    //             // console.log(stats.views);
    //             if (stats) {
    //                 const {
    //                     views,
    //                     clicks,
    //                     conversions,
    //                     conversion_rate
    //                 } = stats;
    //                 setSetup(true);
    //                 setViews(views);
    //                 setUpsellCart(upsell_in_cart);
    //                 setUpsellPostPurchase(upsell_post_purchase);
    //             }
    //             else{
    //                 console.error(error);
    //             }
    //             setLoading(false);
    //         });
    //     }
    //   }, []);
      Axios({
                type: "get",
                url: "/merchant/edit_offer?id="+id,
                headers: {
                    'Content-Type': 'application/json'
                },
            }, function(error, data){
                if (data) { 
                    const { 
                        views,
                        clicks,
                        conversion,
                        conversion_rate
                    } = data;
                    setViews(views);
                    setClicks(clicks);
                    setConversion(conversion);
                    setConversionRate(conversion_rate);
                }
                else{
                    console.error(error);
                }
                setLoading(false);
            });
            

    // function render_offer_products() {
    //     var list =  matching_products.map((product, index) => [
    //         <div className="Product-List_Item" key={index+"2shfq"}>
    //             <Stack alignment="center">
    //                 <Stack.Item fill>
    //                     <Stack spacing="extraTight" alignment="center">
    //                         {/* <Stack.Item>
    //                             <Icon source={DragHandleMinor}></Icon>
    //                         </Stack.Item> */}
    //                         <Stack.Item>
    //                             <Thumbnail source={product.image?product.image.originalSrc:""}></Thumbnail>
    //                         </Stack.Item>
    //                         <Stack.Item>
    //                             <TextStyle variation="strong">{product.title}</TextStyle>
    //                         </Stack.Item>
    //                     </Stack>
    //                 </Stack.Item>
    //                 <Stack.Item>
    //                     <Button
    //                         disabled={method === "edit"}
    //                         plain
    //                         monochrome
    //                         icon={MobileCancelMajor}
    //                         onClick={() => {
    //                             // immuteable array
    //                             var prod = JSON.parse(JSON.stringify(matching_products));
    //                             prod.splice(index, 1);
    //                             setProducts(prod);
    //                         }}
    //                     ></Button>
    //                 </Stack.Item>
    //             </Stack>
    //         </div>
    //     ]);
    //     return <Stack vertical spacing="baseTight">{list}</Stack>;
    // }

    // function render_trigger_products() {
    //     var list =  trigger_products.map((product, index) => [
    //         <Tag
    //             disabled={method === "edit"}
    //             onRemove={() => {
    //                 // immuteable array
    //                 var tr_prod = JSON.parse(JSON.stringify(trigger_products));
    //                 tr_prod.splice(index, 1);
    //                 setTriggerProducts(tr_prod);
    //             }}
    //         >{product.title}</Tag>
    //     ]);
    //     return <Stack>{list}</Stack>;
    // }

    // function sendData(){
    //     var add_offer = {
    //         "password": "UpsellCrosssell123",
    //         "store_name": "ali_store",
    //         "ab_testing": false,
    //         "offer_name": offer_name,
    //         "upsell_product_page": upsell_product_page,
    //         "upsell_in_cart": upsell_in_cart,
    //         "upsell_post_purchase": upsell_post_purchase,
    //         "matching_products": matching_products,
    //         "trigger_products": trigger_products,
    //         "randomize": randomize
    //        };
    //     Axios({
    //         type: "post",
    //         url: "/merchant/add_offer",
    //         data: JSON.stringify(add_offer),
    //         headers: { 
    //             'Content-Type': 'application/json'
    //         },
    //     }, function (error, saved) {
    //         console.log(error, saved);
            
    //         navigate("/offers");
    //     });
    // }

    if (loading) {
        return <LoadingSkeleton></LoadingSkeleton>
    }

    return (
        <Page
            title={method === "edit"?"Show Offer":"Add Offer"}
            breadcrumbs={[{
                content: "Offers",
                onAction: () => {
                    navigate("/offers");
                }
            }]}
        >
            <TitleBar
                title={method === "edit"?"Show Offer":"Add Offer"}
                primaryAction={method === "edit"?null:{
                    content: "Save offer",
                    onAction: () => {
                        sendData();
                    }
                }}
            ></TitleBar>
            {/* {
                product_modal_open && 
                <ResourcePicker
                    resourceType="Product"
                    showVariants={false}
                    open={true}
                    onCancel={() =>{
                        setProductModal(false);
                        setProductModalTrigger(false);
                    }}
                    onSelection={(selections) => {
                        if (selections && selections.selection) {
                            var products = [];
                            try {
                                products = selections.selection.map(x => {
                                    return {
                                        id: getID(x.id),
                                        title: x.title,
                                        image: x.images?x.images[0]:{}
                                    }
                                })
                            } catch (e) { }
                            if (product_modal_open_for_trigger) {
                                setTriggerProducts(products);
                            }
                            else{
                                setProducts(products);
                            }
                        }
                        setProductModal(false);
                        setProductModalTrigger(false);
                    }}
                    initialSelectionIds={product_modal_open_for_trigger?trigger_products:matching_products}
                ></ResourcePicker>
            } */}
            <Layout>
                {
                    // method === "edit" && 
                    <Layout.Section>
                        <Card sectioned title="Summary for all time">
                            <Stack distribution="fill" >
                                <SummaryCard title={"Views"} content={views}/>
                                <SummaryCard title={"Clicks"} content={clicks}/>
                                <SummaryCard title={"Conversions"} content={conversion}/>
                                <SummaryCard title={"Conversions value"} content={conversion_rate}/>
                            </Stack>
                        </Card>
                    </Layout.Section>
                }
                {/* <Layout.AnnotatedSection
                    title="Upsell type"
                    description={"Select an upsell type"}
                >
                    {
                        setup? 
                        <ViewSetupSection
                            upsell_in_cart={upsell_in_cart}
                            upsell_product_page={upsell_product_page}
                            upsell_post_purchase={upsell_post_purchase}
                        ></ViewSetupSection>
                        :<Card>
                            <Card.Section>
                                <Stack vertical spacing="extraLoose">
                                    <Banner>
                                        <p>To understand the different upsell types, <Link>See this article</Link></p>
                                    </Banner>
                                    <FormLayout>
                                        <Label>Placement</Label>
                                        <Stack>
                                            <Button
                                                icon={ProductsMajor}
                                                primary={upsell_product_page}
                                                onClick={() => {
                                                    setUpsellProduct(!upsell_product_page)
                                                }}
                                            >Product Page</Button>
                                            <Button
                                                icon={CartMajor}
                                                primary={upsell_in_cart}
                                                onClick={() => {
                                                    setUpsellCart(!upsell_in_cart)
                                                }}
                                            >Cart Page</Button>
                                            <Button
                                                icon={CheckoutMajor}
                                                primary={upsell_post_purchase}
                                                onClick={() => {
                                                    setUpsellPostPurchase(!upsell_post_purchase)
                                                }}
                                            >Checkout Page</Button>
                                        </Stack>
                                    </FormLayout>
                                    <ImagePreview       
                                        upsell_in_cart={upsell_in_cart}
                                        upsell_product_page={upsell_product_page}
                                        upsell_post_purchase={upsell_post_purchase}
                                    ></ImagePreview>
                                </Stack>
                            </Card.Section>
                        </Card>
                    }
                </Layout.AnnotatedSection>
                {
                    setup && <Layout.AnnotatedSection
                        title="Trigger"
                        description="Select the products that trigger the offer."
                    >
                        <Card>
                            <Card.Section>
                                <Stack vertical >
                                    <Stack spacing="extraTight">
                                        <Button
                                            disabled={method === "edit"}
                                            onClick={() => {
                                                setProductModalTrigger(true);
                                                setProductModal(true);
                                            }}
                                        >
                                            {
                                                trigger_products.length > 0 ? "View and select products":"Select products"
                                            }
                                        </Button>
                                        <Select
                                            disabled={method === "edit"}
                                            label="By products or variants"
                                            labelHidden
                                            value={offer_trigger_by}
                                            onChange={handleOfferTriggerBy}
                                            options={[
                                                {
                                                    label: "By Products",
                                                    value: "by_products"
                                                },
                                                {
                                                    label: "By Variants",
                                                    value: "by_variants"
                                                }
                                            ]}
                                        />
                                    </Stack>
                                    <TextStyle variation="subdued">
                                        Example: If you upsell French Fries along with the burger, French Fries will be the offer product.
                                    </TextStyle>
                                    <div>{render_trigger_products()}</div>
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Layout.AnnotatedSection>
                }
                {
                    setup && <Layout.AnnotatedSection
                        title="Offer products"
                        description="Select the products to upsell / cross sell."
                    >
                        <Card>
                            <Card.Section>
                                <Stack vertical >
                                    <Stack spacing="extraTight">
                                        <Button
                                            disabled={method === "edit"}
                                            onClick={() => {
                                                setProductModal(true);
                                                setProductModalTrigger(false);
                                            }}
                                        >
                                            {
                                                matching_products.length > 0 ? "View and select products":"Select products"
                                            }
                                        </Button>
                                        <Select
                                            disabled={method === "edit"}
                                            label="By products or variants"
                                            labelHidden
                                            value={offer_by}
                                            onChange={handleOfferBy}
                                            options={[
                                                {
                                                    label: "By Products",
                                                    value: "by_products"
                                                },
                                                {
                                                    label: "By Variants",
                                                    value: "by_variants"
                                                }
                                            ]}
                                        />
                                    </Stack>
                                    <TextStyle variation="subdued">
                                        Example: If you upsell French Fries along with the burger, French Fries will be the offer product.
                                    </TextStyle>
                                    <div>{render_offer_products()}</div>
                                    <Checkbox
                                        disabled={method === "edit"}
                                        label="Randomize order each time"
                                        helpText="Order of products will be shuffled randomly."
                                        checked={randomize}
                                        onChange={handleRandomize}
                                    />
                                    {
                                        matching_products.length > 2 && 
                                        <Banner status="warning" title="We recommend to choose one or two offer products for best conversion."></Banner>
                                    }
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Layout.AnnotatedSection>
                }
                {
                    setup && <Layout.AnnotatedSection
                        title="Other details"
                    >
                        <Card>
                            <Card.Section>
                                <FormLayout>
                                    <TextField
                                        disabled={method === "edit"}
                                        label="Offer name - For internal reference"
                                        value={offer_name}
                                        onChange={handleOfferName}
                                        placeholder="Eg: Upsell for mobile phones"
                                    />
                                </FormLayout>
                            </Card.Section>
                        </Card>
                    </Layout.AnnotatedSection>
                }
                {
                    !setup && 
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                disabled: !upsell_in_cart && !upsell_post_purchase && !upsell_product_page,
                                content: "Setup Offer >",
                                onAction: () => {
                                    setSetup(true);
                                }
                            }}
                        ></PageActions>
                    </Layout.Section>
                } */}
                {/* <Layout.Section></Layout.Section>
                <Layout.Section>
                    <FooterHelp>
                        Need help{' '}
                        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
                            View user guide
                        </Link>
                    </FooterHelp>
                </Layout.Section> */}
            </Layout>
        </Page>
    )
}


function ViewSetupSection({ upsell_in_cart,  upsell_product_page, upsell_post_purchase }) {
    return <Card>
        <Card.Section>
            <Stack vertical>
                <Stack.Item>
                    <TextStyle variation="strong">Placement</TextStyle>
                </Stack.Item>
                <Stack.Item>
                    <Stack vertical spacing="extraTight">
                    {
                        upsell_in_cart && <div>Cart Page</div>
                    }
                    {
                        upsell_product_page && <div>Product Page</div>
                    }
                    {
                        upsell_post_purchase && <div>Post Checkout Page</div>
                    }
                    </Stack>
                </Stack.Item>
                <Stack.Item>
                    <TextStyle variation="strong">Type</TextStyle>
                </Stack.Item>
                <Stack.Item>
                    Frequently bought together
                </Stack.Item>
            </Stack>
        </Card.Section>
    </Card>;
}

function ImagePreview({ upsell_in_cart,  upsell_product_page, upsell_post_purchase }) {
    if (upsell_product_page) {
        return (<Stack vertical>
            <div>
                <img src={product_page_preview} width="100%"></img>
            </div>
            <div>
                <TextStyle>
                Displays an Amazon style frequently bought together bundle on the product page.
                For example, if you sell Burgers, you can bundle French Fries along with it.
                </TextStyle>
            </div>
        </Stack>);
    }
    else if(upsell_in_cart){
        return (<Stack vertical>
            <div>
                <img src={cart_page_preview} width="100%"></img>
            </div>
            <div>
                <TextStyle>
                Display an upsell funnel before checkout.
                Based on whether the user accepts or declines the first offer, you can show another upsell or downsell.
                </TextStyle>
            </div>
        </Stack>);
    }
    else if(upsell_post_purchase){
        return (<Stack vertical>
            <div>
                <img src={checkout_page_preview} width="100%"></img>
            </div>
            <div>
                <TextStyle>
                Display a list of upsells after the customer makes the payment.
                The customer can add items to the order in a single click.
                </TextStyle>
            </div>
            <div>
                <TextStyle variation="strong">
                    <TextStyle variation="subdued">
                        Note: Post-purchase upsell is only displayed when the customer pays using Shopify payment gateway Credit Card, Shop Pay or PayPal Express.
                    </TextStyle>
                </TextStyle>
            </div>
        </Stack>);
    }
    else{
        return(
            <div></div>
        )
    }
} 