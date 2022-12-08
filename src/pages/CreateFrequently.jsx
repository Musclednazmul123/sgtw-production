import {
    Banner,
    Button,
    Card,
    Checkbox,
    FooterHelp,
    Form,
    FormLayout,
    Icon,
    Label,
    Layout,
    Link,
    Page,
    PageActions,
    RadioButton,
    Select,
    Stack,
    Tag,
    TextField,
    TextStyle,
    Thumbnail,
} from "@shopify/polaris";
import {
    CartMajor,
    CheckoutMajor,
    DragHandleMinor,
    MobileCancelMajor,
    ProductsMajor,
} from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Loading, ResourcePicker, TitleBar } from "@shopify/app-bridge-react";

import product_page_preview from "../assets/product_page_preview.jpg";
import cart_page_preview from "../assets/cart_page_purchase.png";
import checkout_page_preview from "../assets/checkout_page_preview.jpg";
import { Axios } from "../Axios";
import { getID } from "../components/Helper";
import SummaryCard from "../components/SummaryCard";
import store from "store2";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useNavigationHistory } from "@shopify/app-bridge-react";

export default function CreateFrequently({ method }) {
    const { replace } = useNavigationHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(method === "edit" ? true : false);
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
    const [product_modal_open_for_trigger, setProductModalTrigger] =
        useState(false);
    const handleRandomize = useCallback(
        (randomize) => {
            setRandomize(randomize);
        },
        [randomize]
    );
    const handleOfferBy = useCallback(
        (offer_by) => {
            setOfferBy(offer_by);
        },
        [offer_by]
    );
    const handleOfferTriggerBy = useCallback(
        (offer_trigger_by) => {
            setOfferTriggerBy(offer_trigger_by);
        },
        [offer_trigger_by]
    );
    const handleOfferName = useCallback(
        (offer_name) => {
            setOfferName(offer_name);
        },
        [offer_name]
    );

    // const handleTriggerValue = (checked,id)=>{ setTriggerType(id); }

    const navigate = useNavigate();

    const [dismissed, setDismissed] = useState(!0);
    const [HideBanner, ShowBanner] = useState(false);
    useEffect(() => {
        try {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (e) {}
        if (method === "edit") {
            Axios(
                {
                    type: "get",
                    url: "/merchant/frequently-bought/edit?id=" + id,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                function (error, data) {
                    if (data) {
                        const {
                            name,
                            upsell_product_page,
                            upsell_in_cart,
                            upsell_post_purchase,
                            matching_products,
                            trigger_products,
                            randomize,
                        } = data;

                        setSetup(true);
                        setOfferName(name);
                        setUpsellCart(upsell_in_cart);
                        setUpsellPostPurchase(upsell_post_purchase);
                        setUpsellProduct(upsell_product_page);
                        setTriggerProducts(trigger_products);
                        setProducts(matching_products);
                        setRandomize(randomize);
                    } else {
                        console.error(error);
                    }
                    setLoading(false);
                }
            );
        }
    }, []);

    function render_offer_products() {
        var list = matching_products.map((product, index) => [
            <div className="Product-List_Item" key={index + "2shfq"}>
                <Stack alignment="center">
                    <Stack.Item fill>
                        <Stack spacing="extraTight" alignment="center">
                            {/* <Stack.Item>
                                <Icon source={DragHandleMinor}></Icon>
                            </Stack.Item> */}
                            <Stack.Item>
                                <Thumbnail
                                    source={
                                        product.image
                                            ? product.image.originalSrc
                                            : ""
                                    }
                                ></Thumbnail>
                            </Stack.Item>
                            <Stack.Item>
                                <TextStyle variation="strong">
                                    {product.title}
                                </TextStyle>
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
                                var prod = JSON.parse(
                                    JSON.stringify(matching_products)
                                );
                                prod.splice(index, 1);
                                setProducts(prod);
                            }}
                        ></Button>
                    </Stack.Item>
                </Stack>
            </div>,
        ]);
        return (
            <Stack vertical spacing="baseTight">
                {list}
            </Stack>
        );
    }

    function render_trigger_products() {
        var list = trigger_products.map((product, index) => [
            <Tag
                // disabled={method === "edit"}
                onRemove={() => {
                    // immuteable array
                    var tr_prod = JSON.parse(JSON.stringify(trigger_products));
                    tr_prod.splice(index, 1);
                    setTriggerProducts(tr_prod);
                }}
            >
                {product.title}
            </Tag>,
        ]);
        return <Stack>{list}</Stack>;
    }

    function disableSaveButton() {
        var disabled = false;
        if (!offer_name || offer_name.trim() === "" || offer_name.length < 2)
            disabled = true;
        if (trigger_products.length < 1) disabled = true;
        if (matching_products.length < 1) disabled = true;
        if (!setup) disabled = true;
        return disabled;
    }

    function createOfferAPI() {
        if (method === "edit") {
            var update_offer = {
                shop: store("shop"),
                name: offer_name,
                upsell_product_page: upsell_product_page,
                upsell_in_cart: upsell_in_cart,
                upsell_post_purchase: upsell_post_purchase,
                matching_products: matching_products,
                trigger_products: trigger_products,
                randomize: randomize,
            };
            Axios(
                {
                    type: "put",
                    url: "/merchant/frequently-bought/update?id=" + id,
                    data: JSON.stringify(update_offer),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                function (error, updated) {
                    if (error) {
                        setCreatingOffer(false);
                    } else {
                        navigate("/frequently-bought");
                        replace({ pathname: "/frequently-bought" });
                    }
                }
            );
        } else {
            var add_offer = {
                shop: store("shop"),
                name: offer_name,
                upsell_product_page: upsell_product_page,
                upsell_in_cart: upsell_in_cart,
                upsell_post_purchase: upsell_post_purchase,
                matching_products: matching_products,
                trigger_products: trigger_products,
                randomize: randomize,
            };
            Axios(
                {
                    type: "post",
                    url: "/merchant/add_frequently",
                    data: JSON.stringify(add_offer),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                function (error, success) {
                    if (error) {
                        setCreatingOffer(false);
                    } else {
                        if (success && success.success && success.success._id) {
                            navigate("/frequently-bought");
                            replace({ pathname: "/frequently-bought" });
                        }
                        ShowBanner(true);
                        setCreatingOffer(false);
                    }
                }
            );
        }
    }

    if (loading) {
        return <LoadingSkeleton fullWidth={true}></LoadingSkeleton>;
    }

    return (
        <Page>
            <TitleBar
                breadcrumbs={[
                    {
                        content: "Frequently Bought",
                        onAction: () => {
                            navigate("/frequently-bought");
                            replace({ pathname: "/frequently-bought" });
                        },
                    },
                ]}
                title={method === "edit" ? offer_name : "Add Rule"}
                primaryAction={{
                    content: "Save rule",
                    loading: creating_offer,
                    disabled: disableSaveButton(),
                    onAction: () => {
                        setCreatingOffer(true);
                        createOfferAPI();
                    },
                }}
                secondaryActions={[
                    {
                        content: "Back",
                        onAction: () => {
                            navigate("/frequently-bought", { replace: true });
                            replace({ pathname: "/frequently-bought" });
                        },
                    },
                ]}
            ></TitleBar>
            {product_modal_open && (
                <ResourcePicker
                    resourceType="Product"
                    showVariants={false}
                    open={true}
                    onCancel={() => {
                        setProductModal(false);
                        setProductModalTrigger(false);
                    }}
                    onSelection={(selections) => {
                        if (selections && selections.selection) {
                            var products = [];
                            var views = 0;
                            var clicks = 0;
                            if (product_modal_open_for_trigger) {
                                views = undefined;
                                clicks = undefined;
                            }
                            try {
                                products = selections.selection.map((x) => {
                                    var variants = x.variants.map((y) => {
                                        return {
                                            gid: y.id,
                                            id: getID(y.id),
                                            title: y.title,
                                            handle: y.handle,
                                            price: y.price,
                                        };
                                    });
                                    return {
                                        gid: x.id,
                                        id: getID(x.id),
                                        title: x.title,
                                        handle: x.handle,
                                        image: x.images ? x.images[0] : {},
                                        variants: variants,
                                        views: views,
                                        clicks: clicks,
                                    };
                                });
                            } catch (e) {}
                            if (product_modal_open_for_trigger) {
                                setTriggerProducts(products);
                            } else {
                                setProducts(products);
                            }
                        }
                        setProductModal(false);
                        setProductModalTrigger(false);
                    }}
                    initialSelectionIds={
                        product_modal_open_for_trigger
                            ? trigger_products.map((x) => {
                                  return { id: x.gid };
                              })
                            : matching_products.map((x) => {
                                  return { id: x.gid };
                              })
                    }
                ></ResourcePicker>
            )}
            {/* start of frontend */}
            <Layout>
                {setup && (
                    <Layout.Section>
                        <Card>
                            <Card.Section>
                                <Stack vertical>
                                    <Form>
                                        <FormLayout>
                                            <FormLayout.Group>
                                                <TextField
                                                    // disabled={method === "edit"}
                                                    label="Offer name - For internal reference"
                                                    value={offer_name}
                                                    onChange={handleOfferName}
                                                    placeholder="Eg: Upsell for mobile phones"
                                                />
                                                <div></div>
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </Form>
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                )}
                <Layout.Section>
                    <Card title="Upsell Add-ons type">
                        <Card.Section>
                            <p>Select the Upsell Add-ons type.</p>
                            <Layout.Section>
                                <Card sectioned>
                                    <Stack distribution="fill">
                                        <FormLayout>
                                            <FormLayout.Group>
                                                <div
                                                    className={
                                                        upsell_product_page
                                                            ? "click-state"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setUpsellProduct(
                                                            !upsell_product_page
                                                        );
                                                    }}
                                                >
                                                    <Card.Section>
                                                        <Checkbox
                                                            label="Product Page"
                                                            checked={
                                                                upsell_product_page
                                                            }
                                                            onChange={() => {
                                                                setUpsellProduct(
                                                                    !upsell_product_page
                                                                );
                                                            }}
                                                        />
                                                        <Stack vertical>
                                                            <div>
                                                                <img
                                                                    src={
                                                                        product_page_preview
                                                                    }
                                                                    width="100%"
                                                                ></img>
                                                            </div>
                                                            <div>
                                                                <TextStyle>
                                                                Displays an Amazon style frequently bought together bundle on the product page.
                                                                 For example, if you sell Burgers, you can bundle French Fries along with it.
                                                                </TextStyle>
                                                            </div>
                                                        </Stack>
                                                    </Card.Section>
                                                </div>
                                                <div
                                                    className={
                                                        upsell_in_cart
                                                            ? "click-state"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setUpsellCart(
                                                            !upsell_in_cart
                                                        );
                                                    }}
                                                >
                                                    <Card.Section>
                                                        <Checkbox
                                                            label="Cart Page"
                                                            checked={
                                                                upsell_in_cart
                                                            }
                                                            onChange={() => {
                                                                setUpsellCart(
                                                                    !upsell_in_cart
                                                                );
                                                            }}
                                                        />
                                                        <Stack vertical>
                                                            <div>
                                                                <img
                                                                    src={
                                                                        cart_page_preview
                                                                    }
                                                                    width="100%"
                                                                ></img>
                                                            </div>
                                                            <div>
                                                                <TextStyle>
                                                                Display an upsell funnel before checkout. Based on whether the user accepts or declines
                                                                 the first offer, you can show another upsell or downsell.
                                                                </TextStyle>
                                                            </div>
                                                        </Stack>
                                                    </Card.Section>
                                                </div>
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </Stack>
                                </Card>
                            </Layout.Section>
                        </Card.Section>
                    </Card>
                </Layout.Section>
                {setup && (
                    <Layout.Section>
                        <Card title="Trigger" sectioned>
                        <p>Select the products that trigger the offer.</p>
                            <Card.Section>
                                <Stack vertical>
                                    <Stack spacing="extraTight">
                                        <Button
                                            // disabled={method === "edit"}
                                            onClick={() => {
                                                setProductModalTrigger(true);
                                                setProductModal(true);
                                            }}
                                        >
                                            {trigger_products.length > 0
                                                ? "View and select products"
                                                : "Select products"}
                                        </Button>
                                    </Stack>
                                    <TextStyle variation="subdued">
                                        Example: If you frequently bought French
                                        Fries along with the burger, French
                                        Fries will be the offer product.
                                    </TextStyle>
                                    <div>{render_trigger_products()}</div>
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                )}
                {setup && (
                    <Layout.Section>
                        <Card title="Offer products" sectioned>
                            <p>Select the products to upsell / cross sell.</p>
                            <Card.Section>
                                <Stack vertical>
                                    <Button
                                        // disabled={method === "edit"}
                                        onClick={() => {
                                            setProductModal(true);
                                            setProductModalTrigger(false);
                                        }}
                                    >
                                        {matching_products.length > 0
                                            ? "View and select products"
                                            : "Select products"}
                                    </Button>
                                    <TextStyle variation="subdued">
                                        Example: If you upsell French Fries
                                        along with the burger, French Fries will
                                        be the offer product.
                                    </TextStyle>
                                    <div>{render_offer_products()}</div>
                                    <Checkbox
                                        // disabled={method === "edit"}
                                        label="Randomize order each time"
                                        helpText="Order of products will be shuffled randomly."
                                        checked={randomize}
                                        onChange={handleRandomize}
                                    />
                                    {matching_products.length > 2 && (
                                        <Banner
                                            status="warning"
                                            title="We recommend to choose one or two offer products for best conversion."
                                        ></Banner>
                                    )}
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Layout.Section>
                )}

                {!setup && (
                    <Layout.Section>
                        <PageActions
                            primaryAction={{
                                disabled:
                                    !upsell_in_cart &&
                                    !upsell_post_purchase &&
                                    !upsell_product_page,
                                content: "Next >",
                                onAction: () => {
                                    setSetup(true);
                                },
                            }}
                        ></PageActions>
                    </Layout.Section>
                )}
                <Layout.Section></Layout.Section>
                <Layout.Section>
                    <FooterHelp>
                        Need help{" "}
                        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
                            View user guide
                        </Link>
                    </FooterHelp>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

function ViewSetupSection({
    upsell_in_cart,
    upsell_product_page,
    upsell_post_purchase,
}) {
    return (
        <Card>
            <Card.Section>
                <Stack vertical>
                    <Stack.Item>
                        <TextStyle variation="strong">Placement</TextStyle>
                    </Stack.Item>
                    <Stack.Item>
                        <Stack vertical spacing="extraTight">
                            {upsell_in_cart && <div>Cart Page</div>}
                            {upsell_product_page && <div>Product Page</div>}
                            {upsell_post_purchase && (
                                <div>Post Checkout Page</div>
                            )}
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <TextStyle variation="strong">Type</TextStyle>
                    </Stack.Item>
                    <Stack.Item>Frequently bought together</Stack.Item>
                </Stack>
            </Card.Section>
        </Card>
    );
}

function ImagePreview({
    upsell_in_cart,
    upsell_product_page,
    upsell_post_purchase,
}) {
    var pr = (
        <Stack vertical>
            <div>
                <img src={product_page_preview} width="100%"></img>
            </div>
            <div>
                <TextStyle>
                    Displays an Amazon style frequently bought together bundle
                    on the product page. For example, if you sell Burgers, you
                    can bundle French Fries along with it.
                </TextStyle>
            </div>
        </Stack>
    );
    if (upsell_product_page) {
        return <div>{pr}</div>;
    } else if (upsell_in_cart) {
        return (
            <Stack vertical>
                <div>
                    <img src={cart_page_preview} width="100%"></img>
                </div>
                <div>
                    <TextStyle>
                        Display an upsell funnel before checkout. Based on
                        whether the user accepts or declines the first offer,
                        you can show another upsell or downsell.
                    </TextStyle>
                </div>
            </Stack>
        );
    } else if (upsell_post_purchase) {
        return (
            <Stack vertical>
                <div>
                    <img src={checkout_page_preview} width="100%"></img>
                </div>
                <div>
                    <TextStyle>
                        Display a list of upsells after the customer makes the
                        payment. The customer can add items to the order in a
                        single click.
                    </TextStyle>
                </div>
                <div>
                    <TextStyle variation="strong">
                        <TextStyle variation="subdued">
                            Note: Post-purchase upsell is only displayed when
                            the customer pays using Shopify payment gateway
                            Credit Card, Shop Pay or PayPal Express.
                        </TextStyle>
                    </TextStyle>
                </div>
            </Stack>
        );
    } else {
        return <div>{pr}</div>;
    }
}
