# Customer Provider Component for Magento 2 Storefront
Create an abstract component with a customer data to not duplicate the code to each component and send many requests to BE

## Main Idea
You need to show a different content for guests and logged in customer in cached pages.

### Fast implementation - call observable
You can create a component where you will call a data from customer section once
```js
define(['uiElement', 'Magento_Customer/js/customer-data'], (uiElement, customerData) => {
  'use strict';
  
  return uiElement.extend({
    initialize() {
      this._super();
      
      // let's show customer data in the browser's console
      console.log(customerData.get('customer')())
      
      return this;
    }
  });
});
```

If you're logged in, you will see the customer data:<br/>
<img width="672" alt="image" src="https://user-images.githubusercontent.com/28815318/193274622-f2629851-d56c-4fea-a634-d7d43731e996.png">

But try to open the tab Application, choose LocalStorage and clear the record `mage-cache-storage` (just remove that):<br/>
<img width="1490" alt="image" src="https://user-images.githubusercontent.com/28815318/193274937-98192c01-7ddf-4f7b-90ac-9ded0b4d4b77.png">

After the page reloading, you will see the same data with small delay:<br/>
<img width="1496" alt="image" src="https://user-images.githubusercontent.com/28815318/193275213-5a548f5d-3ade-4ed1-892f-72f9e5f54364.png">

But in the console, you have to see an empty object:<br/>
<img width="325" alt="image" src="https://user-images.githubusercontent.com/28815318/193275272-5c5e9e8b-4b1e-4380-8df4-61c4c556c038.png">

So, the observable calling is bad solution, let's find another way.

### Another way - subscribe to updates
As we get a knockout observable, you can subscribe to its updates.

```js
define(['uiElement', 'Magento_Customer/js/customer-data'], (uiElement, customerData) => {
  'use strict';
  
  return uiElement.extend({
    initialize() {
      this._super();
      
      // subscribe to updates and move functionality to a separated method
      customerData.get('customer').subscribe(this.onCustomerSectionUpdates.bind(this));
      
      return this;
    },
    
    onCustomerSectionUpdates(customer) {
      // let's show customer data in the browser's console
      console.log(customer)
    }
  });
});
```

Try reload the page and you have to see nothing:
<img width="446" alt="image" src="https://user-images.githubusercontent.com/28815318/193276317-27107f5b-69ed-4db9-8a95-68eaf42b8c0a.png">

But if you remove `mage-cache-storage` again:
<img width="1490" alt="image" src="https://user-images.githubusercontent.com/28815318/193274937-98192c01-7ddf-4f7b-90ac-9ded0b4d4b77.png">

And reload page, you have to see updates:
<img width="672" alt="image" src="https://user-images.githubusercontent.com/28815318/193274622-f2629851-d56c-4fea-a634-d7d43731e996.png">

But how to have those updates every time without the local storage cleaning? Good question!
And we have another method of customer data to solve our issue. This is `reload`.

After your subscription, let's reload our section:
```js
define(['uiElement', 'Magento_Customer/js/customer-data'], (uiElement, customerData) => {
  'use strict';
  
  return uiElement.extend({
    initialize() {
      this._super();
      
      // subscribe to updates and move functionality to a separated method
      customerData.get('customer').subscribe(this.onCustomerSectionUpdates.bind(this));
      customerData.reload(['customer']);
      
      return this;
    },
    
    onCustomerSectionUpdates(customer) {
      // let's show customer data in the browser's console
      console.log(customer)
    }
  });
});
```

So, now you have to see updates in all cases, such as: simple page reloading, page reloading after local storage cleaning.

### In sum

Advantages:
- simple solution
- fast implementation

Disadvantages:
- each `reload` using is going to send a fetching request to the backend side
- you need to copy-paste all the code to each component where you need that functionality

### More details about sections reloading

If you duplicate all the code to other components (create for example 3 components), open the tab Network and filter requests by the content:
```
?sections=customer
```
<img width="1492" alt="image" src="https://user-images.githubusercontent.com/28815318/193278085-7ba75818-0134-4f68-bb3c-418120219b32.png">

You is going to see 3 requests to BE side. Just imagine if you will have 10-20 components. 
You will send 10-20 requests at the same time to the BE side on page loading. And you need to duplicate the same code to all 10-20 `.js` files.

## Right solution

Create an abstract model and view components. Check the repository's code and you will see the solution with a lot of comments about functionality.
Small description is existing below.

### Abstract Model
Create one model component which has to send just only 1 request to BE side on the page loading and save this data inside the component.

Check the XML structure:<br/>
https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/layout/default.xml

And JS implementation:<br/>
https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/web/js/model/customer-data-abstract.js

### Abstract View
Create a view component which has the model component as a dependency and import data from the model. 
This component could be extended by other custom components.

Check the XML structure:<br/>
https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/layout/default.xml

And JS implementation:<br/>
https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/web/js/view/customer-data-abstract.js

### Other custom components
There are examples how to extend the absctract view component:
- https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/web/js/view/custom1.js
- https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/web/js/view/custom2.js
- https://github.com/Inevix/magento2-customer-provider-component/blob/main/Magento_Customer/web/js/view/custom3.js



