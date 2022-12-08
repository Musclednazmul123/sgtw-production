import { Page, Layout, Card, Icon,Button } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import '../assets/style.css';
import {
  AbandonedCartMajor, ExistingInventoryMajor, TemplateMajor,RecentSearchesMajor, CartUpMajor, CustomersMajor, FolderDownMajor, ShipmentMajor, VocabularyMajor,InstallMinor, SettingsMajor,CirclePlusMajor,QuestionMarkInverseMajor,FinancesMajor
} from '@shopify/polaris-icons';
import { useNavigate } from "react-router";
import {useNavigationHistory} from '@shopify/app-bridge-react';
import store from "store2";
import { useCallback, useEffect, useState } from "react";
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
          setPlan("Pricing ("+plan+")");
      }
      else{
          console.error(error);
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
              <Layout>
              <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/offers");
                    replace({pathname: '/offers'});
                  }}>
                <div className="card-class">
                  <Icon source={AbandonedCartMajor} color="base" />
                  <Card title="Upsell Offer" sectioned><p>Create upsell offer for your customers.</p></Card>
                  </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird> 
                <div className="Polaris_card" onClick={() => {
                    navigate("/frequently-bought");
                    replace({pathname: '/frequently-bought'});
                  }}>
                <div className="card-class">
                <Icon source={CustomersMajor} color="base" />
                <Card title="Frequently Bought Together" sectioned><p>Your Customer can buy related products with one single click.</p></Card>
                </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird>
                  <div className="Polaris_card" onClick={() => {
                    navigate("/recommended-products");
                    replace({pathname: '/recommended-products'});
                  }}>
                  <div className="card-class">
                  <Icon source={ExistingInventoryMajor} color="base" />
                  <Card title="Product Recommendation" sectioned><p>Create Product Recommendation for your customers.</p></Card>
                </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/recently-view");
                    replace({pathname: '/recently-view'});
                  }}>
                <div className="card-class">
                <Icon source={RecentSearchesMajor} color="base" />
                <Card title="Recently View" sectioned><p>Manage the Recently viewewd products.</p></Card>
                  </div>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/templates");
                    replace({pathname: '/templates'});
                  }}>
                <div className="card-class"> 
                <Icon source={TemplateMajor} color="base" />
                <Card title="Templates" sectioned><p>Select Layout that how customer view selected template.</p></Card>
                </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/settings");
                    replace({pathname: '/settings'});
                  }}>
                <div className="card-class">
                <Icon source={SettingsMajor} color="base" />
                <Card title="Settings" sectioned><p>Configuring the Upsell application settings.</p></Card>
                </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/installation");
                    replace({pathname: '/installation'});
                  }}>  
                <div className="card-class">
                <Icon source={InstallMinor} color="base" />
                <Card title="Installation / Uninstallations" sectioned><p>Instructions to install or unistall the wholesale app.</p></Card>
                </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/payments");
                    replace({pathname: '/payments'});
                  }}>
                <div className="card-class">
                <Icon source={FinancesMajor} color="base" />
                <Card title={plan?plan:"Pricing"} sectioned><p>Manage your wholesale subscription and billing.</p></Card>
                </div>
                </div>
                </Layout.Section>

                <Layout.Section oneThird>
                <div className="Polaris_card" onClick={() => {
                    navigate("/user-guide");
                    replace({pathname: '/user-guide'});
                  }}>
                <div className="card-class">
                <Icon source={VocabularyMajor} color="base" />
                <Card title="User Guide" sectioned><p>Guidelines how to setup and use wholesale discounts.</p></Card>
                </div>
                </div>
                </Layout.Section>

          </Layout>
            </Card>
          </Layout.Section>
        </Layout>
      </span>
    </Page>
  );
}