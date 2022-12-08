import { Banner, Button, Card, Checkbox, FooterHelp,Form  , FormLayout, Icon, Label, Layout, Link, Page, PageActions, RadioButton, Select, Stack, Tag, TextField, TextStyle, Thumbnail } from "@shopify/polaris";
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
import store from "store2";
import LoadingSkeleton from "../components/LoadingSkeleton";
import {useNavigationHistory} from '@shopify/app-bridge-react';

export default function CreatePostPurchase({ method }) {
    const {replace} = useNavigationHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(method === "edit"?true:false);
    const [creating_offer, setCreatingOffer] = useState(false);
    const [offer_name, setOfferName] = useState("");
    const [upsell_in_cart, setUpsellCart] = useState(false);
    const [upsell_product_page, setUpsellProduct] = useState(false);
    const [upsell_post_purchase, setUpsellPostPurchase] = useState(false);
    const [setup, setSetup] = useState(true);
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
    const handleOfferName = useCallback((offer_name) => {setOfferName(offer_name)}, [offer_name]);
    const navigate = useNavigate();

    const [trigger_type, setTriggerType] = useState("all_products");
    const handleTriggerValue = useCallback((check,trigger_type) => {setTriggerType(trigger_type)}, [trigger_type]);

    const [trigger_tags, setTriggerTags] = useState([]);
    const [tag_input, setTagInput] = useState("");
    const handleTagInput = useCallback((tag_input) => {setTagInput(tag_input)}, [tag_input]);
    const TagInputForm = useCallback(() => {
        var t = trigger_tags;
        if(tag_input && tag_input.trim() && !trigger_tags.includes(tag_input.trim().replace(/\,/g,""))){
            t.push(tag_input.trim().replace(/\,/g,""));
            setTriggerTags(t);
        }
        setTagInput("");
    }); 


    const [dismissed, setDismissed] = useState(!0);
    const [HideBanner, ShowBanner] = useState(false);
    useEffect(() => {
        try { 
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } catch (e) { }
        if (method === "edit") {
        Axios({
            type: "get",
            url: "/merchant/post_purchase/edit?id="+id,
            headers: {
                'Content-Type': 'application/json'
            },
        }, function(error, data){
            if (data) {
                const {
                    name,
                    matching_products,
                    trigger_type,
                    trigger_tags,
                    trigger_products, 
                    randomize
                } = data;
                setSetup(true);
                setOfferName(name);
                setUpsellCart(upsell_in_cart);
                setUpsellPostPurchase(upsell_post_purchase);
                setUpsellProduct(upsell_product_page);
                setTriggerType(trigger_type);
                setTriggerTags(trigger_tags);
                setTriggerProducts(trigger_products);
                setProducts(matching_products);
                setRandomize(randomize);
            }
            else{
                console.error(error);
            }
            setLoading(false);
        });
        }
      }, []);

    function render_offer_products() {
        var list =  matching_products.map((product, index) => [
            <div className="Product-List_Item" key={index+"2shfq"}>
                <Stack alignment="center">
                    <Stack.Item fill>
                        <Stack spacing="extraTight" alignment="center">
                            {/* <Stack.Item>
                                <Icon source={DragHandleMinor}></Icon>
                            </Stack.Item> */}
                            <Stack.Item>
                                <Thumbnail source={product.image?product.image.originalSrc:""}></Thumbnail>
                            </Stack.Item>
                            <Stack.Item>
                                <TextStyle variation="strong">{product.title}</TextStyle>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <Button
                            // disabled={method === "edit"}
                            plain
                            monochrome
                            icon={MobileCancelMajor}
                            onClick={() => {
                                // immuteable array
                                var prod = JSON.parse(JSON.stringify(matching_products));
                                prod.splice(index, 1);
                                setProducts(prod);
                            }}
                        ></Button>
                    </Stack.Item>
                </Stack>
            </div>
        ]);
        return <Stack vertical spacing="baseTight">{list}</Stack>;
    }

    function render_trigger_tags(){
        var tag_list =  trigger_tags.map((tag, index) => [
            <Tag
                onRemove={() => {
                    var tr_tag = JSON.parse(JSON.stringify(trigger_tags));
                    tr_tag.splice(index, 1);
                    setTriggerTags(tr_tag);
                }}
            >{tag}</Tag>
        ]);
        return <Stack>{tag_list}</Stack>;
    }

    function render_trigger_products() {
        var list =  trigger_products.map((product, index) => [
            <Tag
                // disabled={method === "edit"}
                onRemove={() => {
                    // immuteable array
                    var tr_prod = JSON.parse(JSON.stringify(trigger_products));
                    tr_prod.splice(index, 1);
                    setTriggerProducts(tr_prod);
                }}
            >{product.title}</Tag>
        ]);
        return <Stack>{list}</Stack>;
    }

    function disableSaveButton(){
        var disabled = false;
        if (!offer_name || offer_name.trim() === "" || offer_name.length < 2) disabled = true;
        if (trigger_type == "specific_product" && trigger_products.length < 1) disabled = true;
        if (trigger_type == "tagged_product" && trigger_tags.length < 1) disabled = true; 
        if (matching_products.length < 1) disabled = true;
        if (!setup) disabled = true;
        return disabled;
    }

    function createOfferAPI(){
        if (method === "edit"){
            var update_offer = {
                "shop": store("shop"),
                "name": offer_name,
                "matching_products": matching_products,
                "trigger_type": trigger_type,
                "trigger_tags": trigger_tags,
                "trigger_products": trigger_products,
                "randomize": randomize
            };
            Axios({
                type: "put",
                url: "/merchant/update_post_purchase?id="+id,
                data: JSON.stringify(update_offer),
                headers: {
                    'Content-Type': 'application/json'
                },
            }, function (error, updated) {
                    if(error){
                        setCreatingOffer(false);
                    }
                    else{
                        navigate("/post-purchase");
                    }
                }
            )
        }
        else{
        var add_offer = {
            "shop": store("shop"),
            "name": offer_name,
            "matching_products": matching_products,
            "trigger_type": trigger_type,
            "trigger_tags": trigger_tags,
            "trigger_products": trigger_products,
            "randomize": randomize
        };
        Axios({
            type: "post",
            url: "/merchant/add_post_purchase", 
            data: JSON.stringify(add_offer),
            headers: {
                'Content-Type': 'application/json'
            },
        }, function (error, success) {  
            if (error) {
                setCreatingOffer(false);
            }
            else{
                if (success && success.success && success.success._id) {
                    navigate("/post-purchase", {replace: true});
                    replace({pathname: '/post-purchase'});
                }
                ShowBanner(true);
                setCreatingOffer(false);
            }
        });
    }
    }

    if (loading) {
        return <LoadingSkeleton></LoadingSkeleton>
    }

    return (
        <Page>
            <TitleBar
                breadcrumbs={[{
                    content: "Post Purchase",
                    onAction: () => {
                        navigate("/post-purchase");
                        replace({pathname: '/post-purchase'});
                    }
                }]}
                title={method === "edit"?offer_name:"Add Bundle"}
                primaryAction={{
                    content: "Save Bundle",
                    loading: creating_offer,
                    disabled: disableSaveButton(),
                    onAction: () => {
                        setCreatingOffer(true);
                        createOfferAPI();
                    } 
                }}
                secondaryActions= {[
                {
                    content: "Back",
                    onAction: () => {
                    navigate("/post-purchase", {replace: true});
                    replace({pathname: '/post-purchase'});
                    }
                },
                ]}
            ></TitleBar>
            {
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
                            var views = 0;
                            var clicks = 0;
                            if(product_modal_open_for_trigger){
                                views = undefined;
                                clicks = undefined;
                            }
                            try {
                                products = selections.selection.map(x => {
                                    var variants = x.variants.map(y => {
                                        return {
                                            gid: y.id,
                                            id: getID(y.id),
                                            title: y.title,
                                            handle: y.handle,
                                            price: y.price,
                                        }
                                    });
                                    return {
                                        gid: x.id,
                                        id: getID(x.id),
                                        title: x.title,
                                        handle: x.handle,
                                        image: x.images?x.images[0]:{},
                                        variants: variants,
                                        views: views,
                                        clicks: clicks
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
                    initialSelectionIds={product_modal_open_for_trigger?trigger_products.map(x=>{return{"id":x.gid}}):matching_products.map(x=>{return{"id":x.gid}})}
                ></ResourcePicker>
            }
            {/* start of frontend */}
            <Layout>
                {/* {
                    method === "edit" && 
                    <Layout.Section>
                        <Card sectioned title="Summary for all time">
                            <Stack distribution="fill" >
                                <SummaryCard title={"Views"} content={0}/>
                                <SummaryCard title={"Clicks"} content={0}/>
                                <SummaryCard title={"Conversions"} content={0}/>
                                <SummaryCard title={"Conversions value"} content={2}/>
                            </Stack>
                        </Card>
                    </Layout.Section>
                } */}
                {
                    setup && <Layout.AnnotatedSection
                        title="Bundle Name"
                    >
                        <Card>
                            <Card.Section>
                                <FormLayout>
                                    <TextField
                                        // disabled={method === "edit"}
                                        label="Bundle name - For internal reference"
                                        value={offer_name}
                                        onChange={handleOfferName}
                                        placeholder="Eg: Post-purchase for mobile phones"
                                    />
                                </FormLayout>
                            </Card.Section>
                        </Card>
                    </Layout.AnnotatedSection>
                }
                
                {
                    setup && <Layout.AnnotatedSection
                        title="Trigger"
                        description="Select the products that trigger the Bundle."
                    >
                        <Card>
                            <Card.Section>
                                <Stack vertical>
                                <RadioButton
                                        label="All Products"
                                        name="trigger_type"
                                        id="all_products"
                                        checked={trigger_type === 'all_products'}
                                        onChange={handleTriggerValue}
                                    />
                                    <RadioButton
                                        label="All Specific Products"
                                        name="trigger_type"
                                        id="specific_product"
                                        checked={trigger_type === 'specific_product'}
                                        onChange={handleTriggerValue}
                                    />
                                    <RadioButton
                                        label="All Tagged Products"
                                        name="trigger_type"
                                        id="tagged_product"
                                        checked={trigger_type === 'tagged_product'}
                                        onChange={handleTriggerValue}
                                    />
                                </Stack>
                            </Card.Section>
                            { trigger_type == "specific_product"  &&
                            <Card.Section>
                                    <Stack vertical >
                                        <Stack>
                                            <Button
                                                // disabled={method === "edit"}
                                                onClick={() => {
                                                    setProductModalTrigger(true);
                                                    setProductModal(true);
                                                }}
                                            >
                                                {
                                                    trigger_products.length > 0 ? "View and select products":"Select products"
                                                }
                                            </Button>
                                        </Stack>
                                        <TextStyle variation="subdued">
                                            Example: If you bundle French Fries along with the burger, French Fries will be the bundle product.
                                        </TextStyle>
                                        <div>{render_trigger_products()}</div>
                                    </Stack>
                                    </Card.Section>
                                }
                                { trigger_type == "tagged_product"  &&
                                    <Card.Section>
                                        <Stack vertical>
                                            <Form onSubmit={TagInputForm} >
                                                <FormLayout>
                                                    <FormLayout.Group>
                                                        <TextField
                                                            value={tag_input}
                                                            placeholder="Add product tags..."
                                                            onChange={handleTagInput}
                                                        />
                                                        <Button submit primary>Add Tag</Button>
                                                </FormLayout.Group>
                                                </FormLayout>
                                            </Form>
                                            <div>{render_trigger_tags()}</div>
                                        </Stack>
                                    </Card.Section>
                                }
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
                                            // disabled={method === "edit"}
                                            onClick={() => {
                                                setProductModal(true);
                                                setProductModalTrigger(false);
                                            }}
                                        >
                                            {
                                                matching_products.length > 0 ? "View and select products":"Select products"
                                            }
                                        </Button>
                                    </Stack>
                                    <TextStyle variation="subdued">
                                        Example: If you bundle French Fries along with the burger, French Fries will be the bundle product.
                                    </TextStyle>
                                    <div>{render_offer_products()}</div>
                                    <Checkbox
                                        // disabled={method === "edit"}
                                        label="Randomize order each time"
                                        helpText="Order of products will be shuffled randomly."
                                        checked={randomize}
                                        onChange={handleRandomize}
                                    />
                                    {
                                        matching_products.length > 2 && 
                                        <Banner status="warning" title="We recommend to choose one or two bundle products for best conversion."></Banner>
                                    }
                                </Stack>
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
                                content: "Next >",
                                onAction: () => {
                                    setSetup(true);
                                }
                            }}
                        ></PageActions>
                    </Layout.Section>
                }
                <Layout.Section></Layout.Section>
                <Layout.Section>
                    <FooterHelp>
                        Need help {' '}
                        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
                            View user guide
                        </Link>
                    </FooterHelp>
                </Layout.Section>
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
    var pr = <Stack vertical>
        <div>
            <img src={product_page_preview} width="100%"></img>
        </div>
        <div>
            <TextStyle>
            Displays an Amazon style frequently bought together bundle on the product page.
            For example, if you sell Burgers, you can bundle French Fries along with it.
            </TextStyle>
        </div>
    </Stack>;
    if (upsell_product_page) {
        return (
            <div>{pr}</div>
        );
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
        return (
            <div>{pr}</div>
        );
    }
}