// src/utils/customer-graphql.ts

export const CUSTOMER_PROFILE_QUERY = `#graphql
  query {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      defaultAddress {
        address1
        city
        country
      }
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = `#graphql
  query getCustomerOrders($first: Int!) {
    customer {
      orders(first: $first) {
        edges {
          node {
            id
            number
            totalPrice {
              amount
              currencyCode
            }
            fulfillments(first: 10) {
              nodes {
                status
              }
            }
          }
        }
      }
    }
  }
`;
