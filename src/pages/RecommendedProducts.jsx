import { Button, Card, FormLayout, Layout, Page, TextField, Banner,  AppProvider,


    ResourceItem,
    Icon,
    Stack,
    Thumbnail,
    Heading,
    Tooltip,DataTable, SkeletonBodyText } from "@shopify/polaris";
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


export default function RecommendedProducts() {
    const { show } = useToast();
  const [current_page, setPage] = useState(1);
  const {replace} = useNavigationHistory();
  const navigate = useNavigate(); 
  const [recommendations, setRecommendations] = useState(fake_recommendations);
  const [loading, setLoading] = useState(true);
  const [update_recommendation, setUpdateRecommendation] = useState(false);

    useEffect(() => {
        getRecommendation(1);
    }, []);

    function updateRecommendation(){
        setUpdateRecommendation(true);
        setLoading(true);
        Axios({
            url: `/merchant/recommendations/update`,
            type: "post",
            data: {
                shop: store("shop"),
                recommendations: recommendations
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
        setUpdateRecommendation(false);
    }
 
    function getRecommendation(page){
        Axios({
        type: "get", 
        url: "/merchant/recommendations/get",
        headers: {
            'Content-Type': 'application/json'
        },
        }, function(error, data){
            if (data) {
                setRecommendations(data.recommendations);
            }
            else{
                setRecommendations([]); 
            }
            setLoading(false); 
        });
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
                    title="Product Recommendation"
                />
                <Layout>
                <Layout.AnnotatedSection
                    title="Select Conditions"
                    description="Select the conditions to show related products. You can choose any of these conditions or all at once, priority will be decided as per the order of conditions below."
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
            title="Product Recommendation"
            primaryAction={{
                loading: update_recommendation,
                content: "Save",
                onAction: () => {
                    updateRecommendation();
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
                                    <Stack.Item>
                                        <DataRecommendationsTable
                                            rows={recommendations}
                                            recommendations={recommendations}
                                            callback={(f_recommendations) => {
                                                setRecommendations(f_recommendations);
                                            }}
                                        ></DataRecommendationsTable>
                                    </Stack.Item> 
                                </FormLayout.Group>
                            </FormLayout>
                        </Card.Section>
                    </Card>
                </Layout.AnnotatedSection>
            </Layout>
        </Page>
    );
}

function DataRecommendationsTable({rows, recommendations, callback}) {
    if (!rows || typeof rows !== "object") {
      rows = [];
    }
    return (
      <DataTable
        rows={rows.map((row) => [
            <div>
                <Heading>{row.label}</Heading>
            </div>,
            <div>
                <Toggle
                    defaultChecked={row.active}
                    onChange={(e) => {
                        var active = e.target.checked;
                        var recommendation_index = recommendations.findIndex(x => x.type === row.type);
                        var f_recommendation = JSON.parse(JSON.stringify(recommendations));
                        if(recommendation_index > -1){
                            f_recommendation[recommendation_index].active = active;
                        }
                        if (typeof callback === "function") {
                            callback(f_recommendation);
                        }
                    }}
                />
            </div>
        ])}
        columnContentTypes={[ 
            'text',
            'text',
            'text',
            'text'
        ]}
        headings={[
            'Recommendation Type',
            'Status'
        ]}
      ></DataTable>
    );
  }

const fake_recommendations = [
    {
        "label": "Same Collection Type",
        "type": "collection",
        "active": true
    },{
        "label": "Same Product Type",
        "type": "product",
        "active": true
    },{
        "label": "Same Vendor",
        "type": "vendor",
        "active": true
    },{
        "label": "Same Tags",
        "type": "tag",
        "active": true
    }, 
]; 