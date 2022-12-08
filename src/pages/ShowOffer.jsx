import { Banner, Button, Card, Checkbox, FooterHelp, FormLayout, Icon, Label, Layout, Link, Page, PageActions, RadioButton, Select, Stack, Tag, TextField, TextStyle, Thumbnail } from "@shopify/polaris";
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
import {useNavigationHistory} from '@shopify/app-bridge-react';
 

export default function ShowOffer({ method }) {
    const [current_page, setPage] = useState(1);
    const { uid } = useParams();
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState("");
    const [offer_name, setOfferName] = useState("");
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
    const {replace} = useNavigationHistory();

    useEffect(() => {
        getOffer(current_page);
    }, []);

    function getOffer(){
      Axios({
                type: "get",
                url: "/merchant/offer_summary?uid="+uid,
                headers: { 
                    'Content-Type': 'application/json'
                },
            }, function(error, stats){
                if (stats) {
                    const { 
                        offer_name,
                        views, 
                        clicks,
                        conversion,
                        conversion_rate
                    } = stats;
                    setOfferName(offer_name);
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
        }

            
    if (loading) {
        return <LoadingSkeleton></LoadingSkeleton>
    }

    return (
        <Page
        >
            <TitleBar
                breadcrumbs={[{
                    content: "Offers",
                    onAction: () => {
                        navigate("/offers");
                        replace({pathname: '/offers'});
                    }
                }]}
                title={offer_name}
                secondaryActions={[
                {
                    content: "Back",
                    onAction: () => {
                    navigate("/offers", {replace: true});
                    replace({pathname: '/offers'});
                    }
                },
                ]}
            ></TitleBar>
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
            </Layout>
        </Page>
    )
}