import { Page, Layout, Card, Icon, Heading, TextStyle } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  QuickSaleMajor,
  BuyButtonMajor,
  ViewMajor,
  CreditCardMajor,
  TemplateMajor,
  BlogMajor
} from '@shopify/polaris-icons';
import { useNavigate } from "react-router";
import {useNavigationHistory} from '@shopify/app-bridge-react';
import store from "store2";
import { useEffect, useState } from "react";
import { Axios } from "../Axios";

export default function Home() {
  const {replace} = useNavigationHistory(); 
  const navigate = useNavigate();
  const [plan, setPlan] = useState("");

  useEffect(() => {
    getPayment();
  }, []);

  function getPayment(){
    Axios({
      type: "get",
      url: "/merchant/shop_plan?shop="+store("shop"),
      headers: {
          'Content-Type': 'application/json'
      },
    }, function(error, data){
      if (data) { 
          const {
              plan
          } = data;
          setPlan(plan);
      }
    });
  }

  return (
    <Page>
      <TitleBar
        title="Dashboard"
        primaryAction={{
          content:"Create Upsell Offer",
          onAction: () => {
            navigate("/offers/create", {replace: true});
            replace({pathname: '/offers/create'});
          }
        }}
        />
      <span className="dashboard">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <div className="shfqAppPage">
                {
                  navigations.map((nav_item, index) => [
                    <div className="shfqSection" key={"inkey"+index}>
                      <div onClick={() => {
                        navigate(nav_item.url);
                        replace({pathname: nav_item.url});
                      }}>
                        <div className="shfqMediaField">
                            <div className="shfqItems">
                                <div className="shfqIcon">
                                    <Icon source={nav_item.icon} accessibilityLabel={nav_item.title}></Icon>
                                </div>
                                <div className="shfqContent">
                                    <div className="shfqHeading">
                                      <Heading>{nav_item.title} {((nav_item.id === 1015 && plan) && "("+plan+")")}</Heading>
                                    </div>
                                    <p className="shfqText">
                                      <TextStyle variation="subdued">{nav_item.content}</TextStyle>
                                    </p>
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>
                  ])
                }
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </span>
    </Page>
  );
}

var navigations = [
  {
    id: 1011,
    title: "Upsell & Cross Sell",
    content: "Create and manage offers, see analytics and conversion rates",
    icon: QuickSaleMajor,
    url: "/offers",
    external: false
  },
  {
    id: 1012,
    title: "Frequently Bought Together",
    content: "Create and manage Frequently Bought Together offers, can be integrated on product page andcart page",
    icon: BuyButtonMajor,
    url: "/frequently-bought",
    external: false
  },
  {
    id: 1013,
    title: "Recently Viewed Products",
    content: "Manage settings for Recently Viewed Products",
    icon: ViewMajor,
    url: "/recently-view",
    external: false
  },
  {
    id: 1014,
    title: "Installations/ Uninstallations",
    content: "Instructions to install or uninstall the Muscled Upsell and Order Boost App",
    icon: TemplateMajor,
    url: "/installation",
    external: false
  },
  {
    id: 1015,
    title: "Subscriptions",
    content: "You can manage monthly subscriptions and billings",
    icon: CreditCardMajor,
    url: "/payments",
    external: false
  },
  {
    id: 1016,
    title: "User Guide",
    content: "Guidelines how to use Upsell features and use Frequently Bought Together products",
    icon: BlogMajor,
    url: "",
    external: false
  }
];
