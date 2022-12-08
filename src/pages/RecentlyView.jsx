import { Button, Card, FormLayout, Layout, Page, TextField, Banner,  AppProvider,


  ResourceItem,
  Icon,
  Stack,
  Thumbnail,
  Heading,
  Tooltip,DataTable, SkeletonBodyText , Checkbox } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import Switch from "react-switch";
import {
  SendMajor
} from '@shopify/polaris-icons';
import { TitleBar, useNavigationHistory, useToast } from "@shopify/app-bridge-react";
import { Axios } from  "../Axios";
import store from "store2";
import LoadingSkeleton from "../components/LoadingSkeleton";

import { DragHandleMinor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import en from "@shopify/polaris/locales/en.json"; 
import { useNavigate } from "react-router";
import Toggle from 'react-toggle';
import { data } from "@shopify/app-bridge/actions/Modal";


export default function RecommendedProducts() {
  const { show } = useToast();
  const [current_page, setPage] = useState(1);
  const {replace} = useNavigationHistory();
  const navigate = useNavigate(); 
  const [recently, setRecently] = useState(true);
  const [loading, setLoading] = useState(true);
  const [update_recently, setUpdateRecently] = useState(false);

  const [vendor, setVendor] = useState(false);
  const vendorChange = useCallback((vendor) => setVendor(vendor), [vendor]);

  const [price, setPrice] = useState(false);
  const priceChange = useCallback((price) => setPrice(price), [price]);

  const [compare_at_price, setCompareAtPrice] = useState(false);
  const compareAtPriceChange = useCallback((compare_at_price) => setCompareAtPrice(compare_at_price), [compare_at_price]);

  const [sku, setSku] = useState(false);
  const skuChange = useCallback((sku) => setSku(sku), [sku]);

  const [addtocart, setAddtocart] = useState(false);
  const addtocartChange = useCallback((addtocart) => setAddtocart(addtocart), [addtocart]);

  const [quickview, setQuickview] = useState(false);
  const quickviewChange = useCallback((quickview) => setQuickview(quickview), [quickview]);

  const [reviews, setReviews] = useState(false);
  const reviewsChange = useCallback((reviews) => setReviews(reviews), [reviews]);

  useEffect(() => {
    getRecently(1);
  }, []);

  function getRecently(page){
    Axios({
    type: "get", 
    url: "/merchant/recently/get",
    headers: {
        'Content-Type': 'application/json'
    },
    }, function(error, data){
        if (data) {
            setVendor(data.recently.vendor);
            setPrice(data.recently.price);
            setCompareAtPrice(data.recently.compare_at_price);
            setSku(data.recently.sku);
            setAddtocart(data.recently.addtocart);
            setQuickview(data.recently.quickview);
            setReviews(data.recently.show_reviews);
        }
        else{
          setRecently([]); 
        }
        setLoading(false); 
    });
  }

  function updateRecently(){
    setUpdateRecently(true);
        setLoading(true);
        var update_recently = {
            "vendor": vendor,
            "price": price,
            "compare_at_price": compare_at_price,
            "sku": sku, 
            "addtocart": addtocart,
            "quickview": quickview,
            "show_reviews": reviews
        };
        Axios({
            url: `/merchant/recently/update`,
            type: "post",
            data: {
                shop: store("shop"),
                recently: update_recently
            },
            headers: {
                'Content-Type': 'application/json'
            }, 
        }, 
        function(error, success){
            if (error) {
                show("error", { isError: true });
            }
            else{
                show("Updated");
                if (success && success.success && success.success._id) {
                    navigate(`/`);
                }
                setLoading(false);
            }
        });
        setUpdateRecently(false);
  }

  if (loading) {
    return (
        <Page>
            <TitleBar
            
            breadcrumbs={[{
            content: "Dashboard",
            onAction: () => {
                navigate("/home");
                replace({pathname: '/home'});
            }
        }]}
                title="Recently Viewed"
            />
            <Layout>
            <Layout.AnnotatedSection
                title="Select Conditions"
                description="Select the conditions to show Recently  products. You can choose any of these conditions or all at once, priority will be decided as per the order of conditions below."
            > 
                <Card>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                </Card>
            </Layout.AnnotatedSection>
        </Layout>
        </Page>
    )
  }
  
  return (
    <Page>
        <TitleBar
            breadcrumbs={[{
            content: "Dashboard",
            onAction: () => {
                navigate("/home");
                replace({pathname: '/home'});
            }
        }]}
        title="Recently Viewed"
        primaryAction={{
            loading: update_recently,
            content: "Save",
            onAction: () => {
                updateRecently();
            }
        }}
        secondaryActions={[
            {
                content: "Back",
                onAction: () => {
                    navigate("/", {replace: true});
                    replace({pathname: '/'});
                }
            },
        ]}
        />
        <Layout>
            <Layout.AnnotatedSection
                title="Select Conditions"
                description="Select the conditions to show related products. You can choose any of these conditions or all at once, priority will be decided as per the order of conditions below."
            > 
                <Card>
                    <Card.Section>
                        <FormLayout>
                            <FormLayout.Group>
                                {/* <List />  */}
                                <Stack vertical>
                                    <Checkbox
                                        // defaultChecked={data.recently.vendor === true}
                                        label="Show Vendor"
                                        checked={vendor}
                                        onChange={vendorChange}
                                    />
                                
                                  
                                  <Checkbox
                                    label="Show Price"
                                    checked={price}
                                    onChange={priceChange}
                                  />
                                  <Checkbox
                                    label="Show Compare at Price"
                                    checked={compare_at_price}
                                    onChange={compareAtPriceChange}
                                  />
                                  <Checkbox
                                    label="Show SKU"
                                    checked={sku}
                                    onChange={skuChange}
                                  />
                                  <Checkbox
                                    label="Show Add to Cart Button"
                                    checked={addtocart}
                                    onChange={addtocartChange}
                                  />
                                  <Checkbox
                                    label="Show Quick View Button"
                                    checked={quickview}
                                    onChange={quickviewChange}
                                  />
                                  <Checkbox
                                    label="Show Reviews "
                                    checked={reviews}
                                    onChange={reviewsChange}
                                  />
                                </Stack> 
                            </FormLayout.Group>
                        </FormLayout>
                    </Card.Section>
                </Card>
            </Layout.AnnotatedSection>
        </Layout>
    </Page>
  );
}