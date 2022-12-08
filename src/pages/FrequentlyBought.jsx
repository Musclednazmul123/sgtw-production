import { Page, Layout, EmptyState, Card, Stack, TextContainer, TextStyle, Heading, Badge, TextField, Icon, Select, DataTable, Button, Pagination, ButtonGroup, Modal } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router";
import { SearchMajor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { Axios } from "../Axios";
import Switch from "react-switch";
import SummaryCard from "../components/SummaryCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import {
  EditMajor, DeleteMajor, ViewMajor
} from '@shopify/polaris-icons';
import store from "store2";
import {
  AnalyticsMajor
} from '@shopify/polaris-icons';
import {useNavigationHistory} from '@shopify/app-bridge-react';
import Toggle from 'react-toggle';
import '../assets/toggle-style.css';

  
export default function FrequentlyBought() {
  const {replace} = useNavigationHistory();
  const navigate = useNavigate();
  const [limit, setLimit] = useState(25);
  const [delete_offer_id, setDeleteOfferId] = useState(null);
  const [edit_modal_active, setEditModalActive] = useState(false);
  const [delete_modal_active, setDeleteModalActive] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [searchValue, setSeachValue] = useState("");
  const [pagination, setPagination] = useState(default_pagination);
  const [current_page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchInputOnChange = useCallback((searchValue) => setSeachValue(searchValue),[searchValue]);
  const [searchType, setSeachType] = useState("all");
  const searchTypeOnChange = useCallback((searchType) => setSeachType(searchType),[searchType]);
  const [offers, setOffers] = useState(fake_offers);
  const [summary_of_all_time, setSummary] = useState(fake_summary.summary_of_all_time);
  const [deleting_offer, setDeletingOffer] = useState(false);
  const [views, setViews] = useState("");
  const [clicks, setClicks] = useState("");
  const [conversion, setConversion] = useState("");
  const [conversion_rate, setConversionRate] = useState("");
  

  useEffect(() => {
    getOffers(current_page);
    getFrequently();
  }, []);

  function getFrequently(){
    Axios({
      type: "get",
      url: "/merchant/shop_summary_frequently?shop="+store("shop"),
      headers: {  
          'Content-Type': 'application/json'
      },   
  }, function(error, stats){

      if (stats) { 
          const {   
              views,
              clicks,
              conversion, 
              conversion_rate
          } = stats;
          setViews(views);
          setClicks(clicks);
          setConversion(conversion);
          setConversionRate("$"+conversion_rate);
      }
      else{
          console.error(error);
      }
    });
  }

  function getOffers(page){
    Axios({
      type: "get",
      url: "/merchant/frequently-bought",
      headers: {
        'Content-Type': 'application/json'
      },
    }, function(error, data){
      if (data) {
        if(data && data.collections){
          setOffers(data.collections);
        }
        else{
          setOffers([]);
        }
        if(data && data.paginate){
          setPagination(data.paginate);    
        }
      } 
      else{
        setOffers([]);
        console.error(error);
      }
      setLoading(false);  
    });
  }

  function DeleteOffers(){
    setDeletingOffer(true);
    setPage(1);
    Axios({
      type: "delete",
      url: "/merchant/frequently-bought/delete?id="+delete_offer_id+"&shop="+store("shop"),
      headers: {
        'Content-Type': 'application/json'
      }, 
    }, function(error, success){ 
      setDeleteModalActive(false);
      getOffers(1);
      setLoading(true);
      setDeletingOffer(false);
    });
  } 

  if (loading) {
    return <LoadingSkeleton></LoadingSkeleton>
  }
  
  if(offers.length == 0){
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
        title="Frequently Bought"
        primaryAction={{
          content: "Create Offers",
          
          onAction: () => {
            navigate("/frequently-bought/create", {replace: true});
            replace({pathname: '/frequently-bought/create'});
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
          <Layout.Section>
          <Card sectioned>
          <EmptyState
            heading="Start Frequently Bought Offers"
            action={{ 
              content: "Add Offer",
              onAction: () => {
            navigate("/frequently-bought/create", {replace: true});
            replace({pathname: '/frequently-bought/create'});
          }
               }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Start adding Frequently Bought offers which loves by your customers.</p>
          </EmptyState> 
        </Card>
          </Layout.Section>
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
        title="Frequently Bought"
        primaryAction={{
          content: "Create Rule",
          onAction: () => {
            navigate("/frequently-bought/create", {replace: true});
            replace({pathname: '/frequently-bought/create'});
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
      {
        delete_modal_active &&
        <Modal
          
          open={true}
          title="Delete Offer"
          onClose={() => {
            setDeleteModalActive(false);
          }}
          primaryAction={[
            {
              loading: deleting_offer,
              content: 'Delete',
              onAction: () => {
                DeleteOffers();
              }
            },
          ]}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => {
                setDeleteModalActive(false);
              }
            },
          ]}
        >
          <Modal.Section>
            Are you sure to Delete offer ?
          </Modal.Section>
        </Modal>
      }
    <Layout>
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
      <Layout.Section>
        <Card
          title={
            <Stack>
              <Stack.Item fill>
                <Stack alignment="center">
                  <Heading>Offers</Heading>
                  <Badge>{offers.length}</Badge>
                </Stack>
              </Stack.Item>
              <Stack.Item>
                <TextStyle variation="subdued">
                  Matrics are shown for all time
                </TextStyle>
              </Stack.Item>
            </Stack>
          }
        >
          <Card.Section>
            <Stack vertical spacing="extraLoose">
              <Stack.Item>
                <Stack alignment="center">
                  <Stack.Item fill>
                    <TextField
                      labelHidden
                      label="Search"
                      prefix={<Icon source={SearchMajor}></Icon>}
                      value={searchValue}
                      onChange={searchInputOnChange}
                      placeholder="Search by offer name, tag or product title"
                    />
                  </Stack.Item>
                  <Stack.Item>
                    <div style={{width: "220px"}}>
                      <Select
                        labelHidden
                        label="Search Type"
                        value={searchType}
                        onChange={searchTypeOnChange}
                        placeholder="Placement/Type"
                        options={[
                          {
                            label: "All",
                            value: "all"
                          },
                          {
                            label: "Product Page",
                            value: "product_page"
                          },
                          {
                            label: "Cart Page",
                            value: "cart_page"
                          },
                          {
                            label: "Post Checkout Page",
                            value: "post_checkout_page"
                          }
                        ]}
                      />
                    </div>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Stack.Item>
                <DataOffersTable
                  searchType={searchType}
                  searchValue={searchValue}
                  rows={offers}
                  offers={offers}
                  callback={(f_offers) => {
                    setOffers(f_offers);
                    // setLoading(true);
                  }}
                  onUpdate={() => {
                    setLoading(false);
                    setPage(1);
                    getOffers(1);
                  }}
                  onEditClick={(item) => {
                    setEditModalActive(true);
                  }}
                  onDeleteClick={(item) => {
                    setDeleteOfferId(item._id);
                    setDeleteModalActive(true);
                  }}
                ></DataOffersTable>
              </Stack.Item>
            </Stack>
          </Card.Section>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Stack alignment="center" distribution="center">
          <Pagination
            hasNext={pagination.next_page}
            hasPrevious={pagination.prev_page}
            onNext={() => {
              var nxt_pg = current_page + 1;
              setPage(nxt_pg);
              getOffers(nxt_pg);
            }}
            onPrevious={() => {
              var prv_pg = current_page - 1;
              setPage(prv_pg);
              getOffers(prv_pg);
            }}
          ></Pagination>
        </Stack>
      </Layout.Section>
      <Layout.Section></Layout.Section>
    </Layout>
    </Page>
  );
}
function DataOffersTable({rows, searchType, searchValue, offers, callback, onUpdate, onEditClick, onDeleteClick}) {
  const navigate = useNavigate();
  const {replace} = useNavigationHistory();
  let store_link = 'https://'+store("shop");
  if (!rows || typeof rows !== "object") {
    rows = [];
  }
  if (searchType !== "all") {
    switch (searchType) {
      case "product_page":
        rows = rows.filter(x => x.upsell_product_page === true);
        break;
      case "cart_page":
        rows = rows.filter(x => x.upsell_in_cart === true);
        break;
      case "post_checkout_page":
        rows = rows.filter(x => x.upsell_post_purchase === true);
        break;
      default:
        break;
    }
  }
  if (searchValue && searchValue.trim() !== "") {
    try {
      rows = rows.filter(x => x.offer_name.match(new RegExp(searchValue, "gi")));
    } catch (e) {
      
    }
  }
  return (
    <DataTable
      rows={rows.map((row) => [
        <div>
          <Toggle
            defaultChecked={row.active === true}
            onChange={(e) => {
              var active = e.target.checked;
              var offer_index = offers.findIndex(x => x._id === row._id);
              var f_offer = JSON.parse(JSON.stringify(offers));
              if(offer_index > -1){
                f_offer[offer_index].active = active;
              }
              if (typeof callback === "function") {
                callback(f_offer);
              }
              Axios({
                url: `/merchant/frequently-bought/status?id=${row._id}`,
                type: "put",
                data: {
                  active: active,
                  id: row._id, 
                  uid: row.uid
                }, 
                headers: {
                  'Content-Type': 'application/json'
                },
              }, 
              function(error, data){ 
                if (typeof onUpdate === "function") {
                  onUpdate(error, data);
                }
              });
            }} 
          />
        </div>,
        <div>
         <Heading>{row.name}</Heading>
        </div>,
        
        <div>
          <UpsellType
            upsell_in_cart={row.upsell_in_cart}
            upsell_post_purchase={row.upsell_post_purchase}
            upsell_product_page={row.upsell_product_page}
          ></UpsellType>
        </div>,
        <div>
          {row.created_at}
        </div>,
        <ButtonGroup segmented>
        <a target="_blank" href={store_link+'/products/'+row.trigger_products[0].handle}>
                    
          <Button
            icon={ViewMajor}
          />
          </a>
        <Button
            icon={AnalyticsMajor}
            onClick={() => {
                navigate("/frequently-bought/show/"+row.uid);
                replace({pathname: '/frequently-bought/stats'});
            }}
          />
          <Button
            icon={EditMajor}
            onClick={() => {
              if (typeof onEditClick === "function") {
                navigate("/frequently-bought/edit/"+row._id);
                replace({pathname: '/frequently-bought/edit/'+row._id});
              }
            }}
          />
          <Button
            icon={DeleteMajor}
            onClick={() => {
              if (typeof onDeleteClick === "function") {
                onDeleteClick(row);
              }
            }}
          />
        </ButtonGroup> 

      ])}
      columnContentTypes={[
        'text',
        'text',
        'text',
        'text',
      ]}
      headings={[
        'Status',
        'Rule Name',
        'Placement Type',
        'Created At', 
        'Action'
        
      ]}
    ></DataTable>
  );
}

const fake_offers = [
  {
      "_id": "628266dc423a82ea3bb737b9",
      "store_id": 123,
      "product_id": 134124,
      "ab_testing": false,
      "active": true,
      "start_date": "2020-01-01T05:00:00.000Z",
      "product_name" : "zzzzzzz",
      "placement_type" : "zzzzzzz",
      "priority" : "5",
      "run_name": "first run",
      "upsell": {
          "views": 9,
          "matchings": [
              {
                  "product_id": 141414,
                  "clicks": 4
              },
              {
                  "product_id": 151515,
                  "clicks": 0
              }
          ]
      }
  },
  {
      "_id": "6282706c8ad9322c7a8e661a",
      "store_id": 123,
      "product_id": 134123,
      "ab_testing": true,
      "active": true,
      "product_name" : "zzzzzzz",
      "start_date": "2020-01-01T05:00:00.000Z",
      "placement_type" : "zzzzzzz",
      "priority" : "5",
      "run_name": "first run",
      "upsell": [
          {
              "views": 10,
              "matchings": [
                  {
                      "clicks": 0,
                      "product_id": 151515
                  },
                  {
                      "clicks": 1,
                      "product_id": 141414
                  }
              ]
          },
          {
              "views": 9,
              "matchings": [
                  {
                      "clicks": 2,
                      "product_id": 616161
                  },
                  {
                      "clicks": 0,
                      "product_id": 414141
                  },
                  {
                      "clicks": 0,
                      "product_id": 515151
                  }
              ]
          }
      ]
  }
];

const fake_summary = {
  "summary_of_all_time": {
    views: 40,
    clicks: 12,
    conversions: 3,
    conversions_value: "$186.22"
  }
};


function UpsellType({upsell_in_cart,upsell_post_purchase, upsell_product_page }) {
  var types = [];
  if (upsell_in_cart) {
    types.push("Cart page");
  }
  if (upsell_product_page) {
    types.push("Product page");
  }
  if (upsell_post_purchase) {
    types.push("Post checkout page");
  }
  return <div>{types.toString().replace(/\,/g,", ")}</div>;
}

const default_pagination = {
  next_page: null,
  prev_page: null,
  total_records: 10
};