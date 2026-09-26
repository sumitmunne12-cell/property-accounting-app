# RealPage Mastery Catalog: 07 Fixed Assets



# MANUAL: RP Financial Suite Fixed Assets User Guide.pdf


<!-- Page 1 -->
RealPage® Financial Suite 
Fixed Assets 

June 2026 

Doc ID: 299637 

---


<!-- Page 2 -->
IMPORTANT NOTICE: 

THIS DOCUMENTATION IS UPDATED REGULARLY. DOWNLOADED OR PRINTED COPIES 

MAY BE OUT OF DATE. PLEASE ACCESS THE LATEST DOCUMENTATION WITHIN THE 

PRODUCT. 

YOUR USE OF THESE MATERIALS IS GOVERNED BY THE TERMS OF YOUR AGREEMENT 

WITH REALPAGE, INC. OR ITS AFFILIATE(S) (THE “AGREEMENT”), INCLUDING 
APPLICABLE CONFIDENTIALITY RESTRICTIONS. THESE MATERIALS ARE SOLELY FOR 

YOUR USE AND NOT THE USE OF ANY THIRD PARTY. 

Notification 

This document, including any documentation, source programs, object programs, procedures, 
and any other material supplied in connection therewith (collectively, “Materials”), constitutes 
the confidential and proprietary property of RealPage, Inc., its affiliate(s) or, in certain cases, its 
licensors. The Materials may not be copied, distributed, or otherwise disclosed, and may not be 
used in any way unless expressly authorized by RealPage. Any violation of the foregoing 
restrictions is a breach of the Agreement and terminates your right to access or use any of the 
Materials. This notification constitutes part of, and may not be removed from, the Materials. 

Printed in the United States of America 
All third party trademarks referenced by RealPage remain the property of their respective owners. 

RealPage’s use of such trademarks is intended to identify the corresponding third party goods or 
services and does not indicate any relationship, sponsorship or endorsement between RealPage 

and the owners of these trademarks. 

---


<!-- Page 3 -->
© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 
iii 

Contents 

Fixed Assets .......................................................................................................................................... 1 

Introduction to Fixed Assets .................................................................................................................................... 3 

Fixed Assets All Tab............................................................................................................................................................ 4 
Fixed Assets Setup Tab ..................................................................................................................................................... 5 
Fixed Assets Workflow ...................................................................................................................................................... 6 

Setting Up Fixed Assets ............................................................................................................................................. 7 

Configuration ....................................................................................................................................................................... 8 
Asset Classes ........................................................................................................................................................................ 9 
Asset Classes List ............................................................................................................................................................. 10 

Adding an Asset Class ........................................................................................................................................ 11 
Viewing or Editing an Asset Class ................................................................................................................... 12 
Deleting an Asset Class ...................................................................................................................................... 12 
Asset Class Page .............................................................................................................................................................. 13 

Adding an Asset Book to an Existing Asset Class ...................................................................................... 13 

Using Fixed Assets .................................................................................................................................................... 19 

Search & Find ................................................................................................................................................................... 20 
Assets .................................................................................................................................................................................. 21 
Asset Information List..................................................................................................................................................... 22 

Integrating With Assets in Facilities ............................................................................................................... 23 
Adding a New Asset Manually (Fixed Assets) ............................................................................................. 24 
Importing Assets .................................................................................................................................................. 27 
Viewing or Editing an Asset .............................................................................................................................. 30 
Disposing of Assets in Bulk ............................................................................................................................... 31 
Deleting an Asset ................................................................................................................................................. 32 
Asset Information Page ................................................................................................................................................. 33 

Transferring an Asset to Another Location .................................................................................................. 36 
Disposing or Partially Disposing of an Asset ............................................................................................... 37 
Reclassing an Asset to Another Account ...................................................................................................... 39 
Draft Assets ....................................................................................................................................................................... 47 
Draft Assets List ................................................................................................................................................................ 48 

Activating Draft Assets ....................................................................................................................................... 49 
Periodic Tasks ................................................................................................................................................................... 50 
Post Depreciation ............................................................................................................................................................ 51 
Depreciation Batches List .............................................................................................................................................. 52 

Posting Depreciation Journal Entries ............................................................................................................. 53 
Previewing Assets Not Depreciated in Prior Months ................................................................................ 55 

---


<!-- Page 4 -->
Contents 

iv 
RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Viewing Depreciation Batches ......................................................................................................................... 56 
Deleting Depreciation Batches ........................................................................................................................ 56 
Reports ............................................................................................................................................................................... 60 
Asset Info Reports ........................................................................................................................................................... 61 

Customizing and Running Asset Info Reports ............................................................................................ 64 
Asset Reconciliation Report .......................................................................................................................................... 69 

Customizing and Running the Asset Reconciliation Report ................................................................... 70 

---



## Fixed Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 5*

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Fixed Assets 

Fixed Assets is a comprehensive fixed asset management solution suited for businesses and organizations of any 

size, whether you’re managing 10 assets or 10,000. Use this application to track, manage, and analyze your fixed 

assets across the entire asset life cycle, from acquisition to depreciation to disposal. Fixed Assets is fully integrated 

with RealPage Accounting and is capable of automatically generating all General Ledger entries for asset 

depreciation and asset disposal. 

The Fixed Assets documentation is divided into three chapters: 

• 
Introduction to Fixed Assets: (on page 3) This chapter introduces the application’s tabs, components, and 

workflow. 

• 
Fixed Assets Setup: (on page 7) This chapter describes how to configure asset classes. 

• 
Using Fixed Assets: (on page 19) This chapter describes how to use the application to add and manage 

assets, post depreciation entries to the General Ledger, and run asset reports. 

How It Works 

When an asset is created and placed into service, the system automatically generates depreciation schedules 

based on an asset’s class, which determines the type of depreciation method to use (Straight-line, 

Declining-balance, Sum-of-year’s digits, and so on). You have the option to define multiple sets of accounting 

and/or depreciation rules for each asset class so that a depreciation schedule for GAAP accounting and a different 

depreciation schedule for Tax accounting may exist for the same asset. This makes it possible to post depreciation 

on a recurring basis as needed for both GAAP and Tax books or to post depreciation at different intervals for each. 

Key Features 

Fixed Assets provides a variety of features to help you efficiently manage and streamline your fixed assets: 

Track and manage assets 

• 
Keep detailed records of all of your fixed assets, including equipment, property, vehicles, and more. 

• 
Streamline your data entry process by creating assets directly from bills and vendor invoices. 

• 
View and edit asset information, such as the acquisition date, cost, location, and useful life. 

• 
Process and manage assets at the desired level within your organization, ensuring privacy between entities 

and allowing employees to concentrate only on what they need. 

B O O K I 

---


<!-- Page 6 -->
Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Depreciate assets 

• 
Choose the depreciation method or convention that meets your needs. 

• 
Post depreciation to the General Ledger automatically or manually. 

• 
Post depreciation across multiple asset books to ensure compliance with government regulations. Fixed 

assets support multiple depreciation schedules, and each schedule can use a different depreciation method 

and book. 

• 
Receive automatic email notifications to keep you up-to-date on the status of your depreciation posting. 

Gain new insights from reports 

• 
Run summary or detail reports for asset activity, depreciation, and disposal. 

• 
Run reconciliation reports to compare your asset balances and G/L balances. 

Setup 

Before using the Fixed Assets application, you or your administrator must subscribe to the application and 

configure asset classes for your company. 

• 
To subscribe to Fixed Assets, see Subscribing to an Application. 

• 
To configure asset classes, see Adding an Asset Class (on page 11). 

Workflow 

The Fixed Assets application has a specific workflow involving multiple components. See Fixed Assets Workflow 

(on page 6) for an overview of this process. 

In This Book 

Introduction to Fixed Assets ................................................................................................................ 3 

Setting Up Fixed Assets ......................................................................................................................... 7 

Using Fixed Assets ................................................................................................................................. 19 

---



### Introduction to Fixed Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 7*

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Introduction to Fixed Assets 

This chapter introduces the tabs, components, and workflow of the Fixed Assets application. 

In This Chapter 

Fixed Assets All Tab ................................................................................................................................. 4 

Fixed Assets Setup Tab .......................................................................................................................... 5 

Fixed Assets Workflow ........................................................................................................................... 6 

C H A P T E R 1 

---



#### Fixed Assets All Tab
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 8*

Introduction to Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Fixed Assets All Tab 


> **Navigation Path:** `Applications > Fixed Assets > All`


The All tab in the Fixed Assets application contains the following menu options: 

Search and Find Section 

• 
Assets: (on page 21) Opens the Assets list to add and manage fixed assets. 

• 
Draft assets: (on page 47) Opens the Draft assets list to import and activate assets that are 

coming into RealPage Financial Suite from an external system. 

Periodic Tasks Section 

• 
Post depreciation: (on page 51) Opens the Depreciation batches list to view and post 

depreciation journal entries. 

Reports Section 

• 
Asset info reports: (on page 61) Opens the Asset report page to customize and run the 

Accumulated Depreciation, Asset Disposal, Asset Activity, or Asset List report.  

• 
Asset reconciliation report: (on page 69) Opens the Asset reconciliation report page to 

customize and run the Asset Reconciliation report. 

---



#### Fixed Assets Setup Tab
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 9*

Chapter 1: Introduction to Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Fixed Assets Setup Tab 


> **Navigation Path:** `Application > Fixed Assets > Setup`


The Setup tab in the Fixed Assets application allows you to configure asset classes to associate 

with your assets. 

Configuration Section 

• 
Asset classes: (on page 9) Create asset classes to define which G/L accounts to post to as 

well as which financial books and tax books to use in order to calculate depreciation. 

---



#### Fixed Assets Workflow
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 10*

Introduction to Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Fixed Assets Workflow 

The Fixed Assets application has a specific workflow that flows across multiple objects in RealPage 

Financial Suite. First, you set up asset classes and define their G/L accounts and asset books. Then 

you create assets that work in coordination with the asset classes to automatically generate a 

depreciation schedule. You post these depreciation journal entries from period to period as 

needed. 

Fixed Assets Components 

Fixed Assets has several main components: 

• 
Asset classes 

• 
Assets 

• 
Depreciation schedules 

Asset classes contain information about asset type and the financial and tax books associated 

with it. They also contain information about various, related G/L accounts, including the 

accumulated depreciation account, the depreciation expense account, and the asset account. The 

system uses this information along with other Fixed Assets data fields to determine how to 

generate depreciation for each asset and where to post those depreciation entries. 

Assets hold a variety of information about the asset, from insurance details and photos of the 

asset to warranty information. Most importantly, assets hold the date placed in service, asset cost, 

and dimension information required to post to the G/L. These fields work in coordination with the 

associated asset class and book details to generate your full depreciation schedule and places 

your asset in service. From period to period, you post your depreciation schedule entries until the 

asset is fully depreciated. 

Fixed Assets Workflow 

The workflow for Fixed Assets is as follows: 

1. 
Create asset classes (on page 10) and define their book details. 

2. 
Create assets (on page 22). 

3. 
Post depreciation journal entries (on page 52). 

4. 
Run asset reports (on page 60) as needed. 

---



### Setting Up Fixed Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 11*

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Setting Up Fixed Assets 

This chapter describes how to use the options on the Setup tab of the Fixed Assets application. 

In This Chapter 

Configuration ............................................................................................................................................ 8 

C H A P T E R 2 

---



#### Configuration
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 12*

Setting Up Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Configuration 

This section describes how to use the menu options in the Configuration section of the Setup tab. 

---



#### Asset Classes
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 13*

Chapter 2: Setting Up Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset Classes 

Asset classes are categories of assets that share the same depreciation and accounting rules. As 

you create new assets, the system automatically creates depreciation schedules based on the 

asset class record. When the system posts journal entries, it pulls from the G/L account(s) you 

define in the asset class record and calculates depreciation using the depreciation methods you 

define for your financial and tax asset books. 

---



#### Asset Classes List
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 14*



##### Before You Begin
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 14*

Setting Up Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Classes List 


> **Navigation Path:** `Application > Fixed Assets > Setup > Asset Classes`


Use the Asset classes list to add and manage asset classes. From this list, you can add, edit, view, 

and delete asset class records. You can also export the list of asset classes. 

Before You Begin 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Permissions 

These permissions are required to add and manage asset classes: 

Application 
Activities/Lists 
Permissions 

Fixed Assets 
Asset Class 
List, View, Add, Edit, 

Delete 

If your user account doesn’t have the permissions shown above, then ask your System 

Administrator for assistance. If you have administrator privileges, you can assign permissions for a 

new feature to a user or to a role. See Roles and Permissions for a description of how to review a 

user’s permissions. 

---



##### Adding an Asset Class
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 15*

Chapter 2: Setting Up Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Adding an Asset Class 


> **Navigation Path:** `Application > Fixed Assets > Setup > 
 Asset Classes`


To add an asset class: 

1. 
In the Asset classes list, click the Add button. 

The Asset class page opens. 

2. 
In the Asset class field, type a name for the asset class. 

3. 
In the Description field, type a description for the asset class. 

4. 
In the Accounts drop-down list, select one or more G/L accounts to associate with the asset 
class. For example, if you have an asset class named “Appliances,” you might roll up 
accounts for dishwashers, dryers, etc., into this asset class.  

After you associate an account with an asset class, you cannot use the same account 
again for another asset class. 

5. 
In the Asset books section, define your financial book (and tax book, if needed) to set how 
the system will calculate and post depreciation: 

• 
In the Book type drop-down list, select the type of asset book, such as “General” or 
“Tax”. 

• 
In the Journal drop-down list, select the journal to which the system should post 
depreciation journal entries. 

• 
In the Method drop-down list, select the formula that the system uses to calculate 
depreciation: 

• 
Straight line  

• 
Declining balance (100) 

• 
Declining balance (150) 

• 
Double declining balance (200) 

• 
Sum of years digits 

• 
In the Frequency drop-down list, select the rate at which to depreciate assets over one 
full period: 

• 
Monthly: Depreciate assets once a month. 

• 
Quarterly: Depreciate assets once every three months. 

• 
Yearly: Depreciate assets once a year. 

• 
In the Periods field, type the number of periods that the asset depreciates. 

• 
In the Accumulated depreciation account drop-down list, select the G/L account that 
offsets the cost and is credited when the system posts depreciation transactions. 

• 
In the Depreciation expense account drop-down list, select the G/L account that is 
debited when the system posts depreciation transactions. 

6. 
When you are finished defining your book(s), click Save to save the asset class. 

---



##### Viewing or Editing an Asset Class
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 16*



##### Deleting an Asset Class
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 16*

Setting Up Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Viewing or Editing an Asset Class 


> **Navigation Path:** `Application > Fixed Assets > Setup > Asset Classes > View`



> **Navigation Path:** `Application > Fixed Assets > Setup > Asset Classes > Edit`


To view or edit an asset class: 

• 
In the Asset classes list, find the asset class that you want to view or edit, and then select 

the View or Edit link. 

The Asset class page opens. 

The Book type, Method, Frequency, and Periods fields in the Asset books section cannot be 
changed after you have created and saved an asset class 

To add more asset books to the asset class —such as a tax book—you can use the Add 

book button. This button is available only in Edit mode. See Adding an Asset Book to an 
Existing Asset Class (on page 13 ) for instructions. 

Deleting an Asset Class 


> **Navigation Path:** `Application > Fixed Assets > Setup > Asset Class > Delete`


Asset classes can be deleted as long as there aren’t any fixed assets already associated with the 

class. If you receive an error message while trying to delete an asset class, then you will need to 

delete the asset records (on page 32) tied to that class first. 

To delete an asset class: 

1. 
In the Asset classes list, find the asset class record that you want to delete, and then select 

the Delete link. 

A delete confirmation message opens. 

2. 
Click OK to confirm. 

The asset class is removed from the list. 

---



#### Asset Class Page
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 17*



##### Adding an Asset Book to an Existing Asset Class
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 17*

Chapter 2: Setting Up Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset Class Page 


> **Navigation Path:** `Application > Fixed Assets > Setup > 
 Asset Classes`



> **Navigation Path:** `Application > Fixed Assets > Setup > Asset Classes > View/Edit`


Use the Asset class page to create, view, and modify asset class records. 

This page has two sections: 

• 
(General): The top section summarizes general information about the asset class, including 

the asset class name, description, and the G/L accounts from which the system will pull 

when generating depreciation. 

• 
Asset books: This section defines the financial and tax books that are associated with the 

class, including their depreciation method, frequency, asset life (the number of periods that 

the asset or tax will depreciate), and depreciation accounts. 

Adding an Asset Book to an Existing Asset Class 


> **Navigation Path:** `Application > Fixed Assets > Setup > Asset Classes > Edit`


To add an asset book to an existing asset class: 

1. 
On the Asset class page, in the Asset books section, click the Add book button. 

The Add book box opens. 

The Add book button is available only when you are editing an asset class. 

---


<!-- Page 18 -->
Setting Up Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

2. 
Complete the following fields: 

• 
In the Book type drop-down list, select the type of asset book, such as “General” or 

“Tax”. 

• 
In the Journal drop-down list, select the journal to which the system should post 

depreciation journal entries. 

• 
In the Method drop-down list, select the formula that the system uses to calculate 

depreciation: 

• 
Straight line  

• 
Declining balance (100) 

• 
Declining balance (150) 

• 
Double declining balance (200) 

• 
Sum of years digits 

• 
In the Frequency drop-down list, select the rate at which to depreciate assets over one 

full period: 

• 
Monthly: Depreciate assets once a month. 

• 
Quarterly: Depreciate assets once every three months. 

• 
Yearly: Depreciate assets once a year. 

• 
In the Periods field, type the number of periods that the asset depreciates. 

• 
In the Accumulated depreciation account drop-down list, select the G/L account that 

offsets the cost and is credited when the system posts depreciation transactions. 

• 
In the Depreciation expense account drop-down list, select the G/L account that is 

debited when the system posts depreciation transactions. 

3. 
Click Save in the Add book box, and then click Save again to save the asset class record. 

---



##### Fields
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 19*

Chapter 2: Setting Up Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Fields 

Asset Classes List 

Edit (link) 
Click this link to edit an asset class. 

View (link) 
Click this link to view the details of an asset class. 

Asset class 
This is the asset class name. 

Asset class 

description 

This is a description of the asset class. 

Accumulated 

depreciation 

This is the G/L account number that offsets the cost and is credited when the 

system posts depreciation transactions. 

Depreciation 

expense 

This is the G/L account number that is debited when the system posts 

depreciation transactions. 

Asset accounts (to 

auto-identify 

assets not entered 

in A/P 

These are the G/L accounts associated with the asset class. The system pulls 

from these accounts when calculating and posting depreciation. 

Delete (link) 
Click this link to delete an asset class. 

Asset Class Page 

Asset class 
Type a name for the asset class. 

Description 
Type a description for the asset class. 

Accounts 
Select one or more G/L accounts to associate with the asset class. For 

example, if you have an asset class named “Appliances,” you might select 

separate accounts for dishwashers, dryers, etc. 

After you associate an account with an asset class, you cannot use the 
same account again for another asset class. 

Asset Class Page - Asset Books Section 

Book type 
Select the asset book type, such as “General” or “Tax”. 

Journal 
Select the journal to which the system should post depreciation journal 

entries. 

---



##### Buttons
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 20*

Setting Up Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Method 
Select the formula that the system uses to calculate depreciation. Options 

include: 

• 
Straight line 

• 
Declining balance (100) 

• 
Declining balance (150) 

• 
Double declining balance (200) 

• 
Sum of years digits 

Frequency 
Select the rate at which to depreciate assets over one full period: 

• 
Monthly: Depreciate assets once a month. 

• 
Quarterly: Depreciate assets once every three months. 

• 
Yearly: Depreciate assets once a year. 

Periods 
Type the number of periods that the asset depreciates. 

Accumulated 

depreciation 

account 

Select the G/L account that offsets the cost and is credited when the system 

posts depreciation transactions. 

Depreciation 

expense 

Select the G/L account that is debited when the system posts depreciation 

transactions. 

Buttons 

Asset Classes List 

Add 
Opens the Asset class page with a blank record to create a new asset class. 

Done 
Closes the list and returns to the Fixed Assets home page. 

Export 
Exports the records in the Asset classes list to the selected file format: CSV, 

Excel, Word, or PDF. 

Asset Class Page 

Save 
Saves and closes the record. 

Cancel 
Closes the record and discards any changes. 

Print to... 
Generates a PDF file so that you can print it, or downloads the information in 

XML format. 

Edit 
If you are in View mode, click this button to switch to Edit mode. 

Duplicate 
If you are in View or Edit mode, click this button to copy the data from the 

current record to a new record of the same type. 

---


<!-- Page 21 -->
Chapter 2: Setting Up Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Done 
If you are in View mode, click this button to close the record and return to 

the previous page. 

More actions 
Click this drop-down arrow to display the following additional options: 

• 
Save & new: Saves the record and opens a new blank record. 

• 
View audit trail: Opens a log of changes to the record, including who 

made each change and when they made the change. 

Asset Class Page - Asset Books Section 

Add book 
Opens the Add book box to define additional asset books for the asset class. 

---



### Using Fixed Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 23*

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Using Fixed Assets 

Use the Fixed Assets application to manage and track assets from a central location. This application streamlines, 

simplifies, and improves the accuracy of the complete asset lifecycle. 

This chapter describes the features and functions on the All tab of the Fixed Assets application. 

In This Chapter 

Search & Find .......................................................................................................................................... 20 

Periodic Tasks .......................................................................................................................................... 50 

Reports ....................................................................................................................................................... 60 

C H A P T E R 3 

---



#### Search & Find
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 24*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Search & Find 

This section describes how to use the menu options under the Search & Find section of the All 

tab. 

---



#### Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 25*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Assets 

After you set up asset classes (on page 9), you can create assets. Assets are your company’s 

biggest investments that include property, equipment, investments, patents, and trademarks. 

Asset records hold a variety of information, including: 

• 
Date placed in service 

• 
Asset cost 

• 
Warranty information 

• 
Invoice information. 

These fields work in coordination with the asset’s class and book details to generate the full 

depreciation schedule and place the asset in service. From period to period, you post your 

depreciation journal entries until the asset is fully depreciated. 

---



#### Asset Information List
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 26*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Information List 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets`


Use the Asset information list to add, import, and manage your fixed assets. From this list, you 

can: 

• 
Manually add or import assets with opening depreciation. 

• 
View or edit the details of an asset. 

• 
Show or hide disposed and transferred assets. 

• 
Dispose of assets from your company’s accounting records. 

• 
View the A/P invoice associated with an asset. 

• 
Delete an asset record from the system. 

• 
Export the list of asset records. 

The Asset information list in Fixed Assets automatically pulls in any assets from the Assets list 
in Accounts Payable, including any asset records that were created while entering an A/P invoice 
with asset entry details .  

---



##### Before You Begin
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 27*



##### Integrating With Assets in Facilities
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 27*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Before You Begin 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Permissions 

These permissions are required to add and manage assets: 

Application 
Activities/Lists 
Permissions 

Fixed Assets 
Asset Info 
List, View, Add, Edit, 

Delete 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Integrating With Assets in Facilities 


> **Navigation Path:** `Applications > Accounts Payable > Setup > Configuration > Enable Functionality > 
Enable Asset Integration With Facilities`


To integrate assets in Accounting with Facilities: 

1. 
Open the Accounts Payable menu. 

2. 
Click the Setup tab. 

3. 
In the Enable Functionality section, select the Enable asset integration with Facilities check 

box. Additional options appear. 

4. 
In the Default Asset G/L Account drop-down list, select the G/L account to associate with 

asset transactions that are created in the Facilities application. 

5. 
In the Default Dispose Gain/Loss Account drop-down list, select the account to use for 

recording asset disposals.  

6. 
In the Error failure results to field, type the email address where you want the system to 

send notifications of asset integration failures.  

7. 
Click the Save button. 

---



##### Adding a New Asset Manually (Fixed Assets)
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 28*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Adding a New Asset Manually (Fixed Assets) 


> **Navigation Path:** `Applications > Fixed Assets > All > 
 Assets`


You can create assets from both the Fixed Assets and Accounts Payable applications. When you 

create an asset record, the system automatically creates a matching record for the asset in 

Facilities. If you update an asset in RealPage Accounting, the information is also updated in 

Facilities. If you update an asset in Facilities, the information is also updated in RealPage 

Accounting. 

To add a new asset: 

1. 
In the Asset information list, click the Add button. 

The Asset information page opens on the Asset information tab. 

2. 
In the Asset class drop-down list, select an asset class to associate with the asset. 

3. 
In the Property ID drop-down list, select the property where the asset is located. 

4. 
Optionally, in the Department ID drop-down list, select a department to associate with the 

asset. 

5. 
In the Asset name field, type a descriptive name to identify the asset. 

6. 
In the Asset cost field, type the original cost of the asset. 

7. 
In the G/L account drop-down list, select an account to associate with the asset. 

8. 
In the Asset type drop-down list, select what kind of asset it is. You can add and manage 

asset types from the Asset types list in the Accounts Payable application. 

9. 
In the Salvage value field, type the amount that the asset is estimated to be worth at the 

end of its useful life, when all depreciation is expensed. 

10. 
In the Date placed in service field, type or select the date that the asset began being used. 

The date placed in service does not have to be the same as the purchase date. 

11. 
In the Depreciation convention drop-down list, choose when to start the asset’s 

depreciation schedule: 

• 
Full month: The asset starts depreciating on the first day of the month based on the 

date you entered in the Date placed in service field. 

• 
Mid month: If the Date placed in service falls during the first half of the month (1st 

through 15th), then the asset starts depreciating on the first day of the month. If the 

Date placed in service falls during the second half of the month (16th through 31st), 

then the asset starts depreciating on the first day of the next month. 

• 
Mid quarter: The asset is always treated as if it started in the middle of the quarter to 

prevent the asset from exceeding the maximum depreciation for the year. The first 

---


<!-- Page 29 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

quarter of the schedule is determined by the Date placed in service; it will be 

calculated as a percentage of annual depreciation as follows: 

Q1 - 87.5% 

Q2 - 62.5% 

Q3 - 37.5% 

Q4 - 12.5% 

The Mid quarter option is applicable only to assets whose asset book is set up to 
depreciate assets on a Quarterly basis. Assets books are defined in the asset class 
(on page 11 ).  

12. 
In the Life of asset (periods) field, type the number of periods over which the asset will 

depreciate. The length of a period is determined by your selection in the Depreciation 

convention field. For example, if you select Full month with 45 periods, the asset will 

depreciate over 45 months.  

13. 
Optionally, to enter opening depreciation for the asset, select the Enter opening 

depreciation check box, and then fill in the fields in the corresponding Asset books section: 

• 
In the Opening depreciation field, type the asset’s starting depreciation amount. 

• 
In the Opening depreciation thru field, type or select the date through which the 

opening depreciation accrued. 

Filling in the Additional Information Tab 

Use the Additional information tab to enter invoice information tied to the asset as well as other 

information such as the asset’s warranty and condition. 

If you enter asset information while creating an A/P invoice, then the system automatically 
generates an asset record in both the Assets list in Accounts Payable and the Asset information 
list (on page 22 ) in Fixed Assets. When you edit that asset record in Fixed Assets, the fields on 
the Additional information tab auto-populate with the information that you entered during 
invoice creation. 

To fill in the Invoice information section: 

1. 
In the Vendor drop-down list, select the vendor from which the asset was purchased. 

2. 
In the G/L account drop-down list, select the account associated with the invoice. 

3. 
In the Invoice number field, type the invoice number. 

4. 
In the Quantity field, type the quantity of assets on the invoice. 

5. 
In the Invoice date field, type or select the A/P invoice date.  

---


<!-- Page 30 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

To fill in the Additional information section: 

1. 
In the Serial number field, type the asset’s serial number. 

2. 
In the Model number field, type the asset’s model number. 

3. 
In the Condition drop-down list, select the condition of the asset: 

• 
New 

• 
Used/Good 

• 
Used/Fair 

• 
Used/Poor  

4. 
In the Warranty number field, type the asset’s warranty number. 

5. 
In the Warranty start date field, type or select the date that the asset’s warranty begins. 

6. 
In the Warranty end date field, type or select the date that the asset’s warranty expires. 

Saving the Asset 

When you are finished entering information on the Asset information and Additional 

information tabs, click Save to save the asset record. The system adds the asset to the Asset 

information list. 

---



##### Importing Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 31*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Importing Assets 


> **Navigation Path:** `Applications > Company > All > Import Data > Set Up AP Master List, Open Invoices 
and Adjustments > Assets > Import`



> **Navigation Path:** `Applications > Accounts Payable > All > Assets > Assets > Import`



> **Navigation Path:** `Applications > Fixed Assets > All > Assets / Draft Assets > Import Assets`


The Financial Suite provides import templates for many types of records so you can quickly add 

and update data throughout the system. We recommend that you download a new template 

whenever you use the import feature to ensure that your template is always up to date.  

If you are setting up your company for the first time, it’s best to import data in the order listed on 

the Import data page. Templates on the Import data page are automatically customized based 

on your company’s configuration, including any dimensions or custom fields that you’ve created. 

Importing asset information into RealPage Accounting adds a new asset record to RealPage 

Accounting’s Accounts Payable and Fixed Assets, and to the Facilities application. 

Importing Historical Assets Information From Facilities into RealPage Accounting 

For every asset record that you want to import into Accounting, fill in the FACILITIES_ASSET_ID 

column with the asset ID from the Facilities application. This tells the system that the asset already 

exists in Facilities, and that it is creating historical asset information. The system will not create a 

new asset record in Facilities. Without the FACILITIES_ASSET_ID column filled in, the system will 

create duplicate records in Facilities. 

Downloading the Import Template 

To download the import template for assets: 

1. 
Open the Company menu, and then click the Import data menu option. The Import data 

page opens. 

2. 
In the Set up A/P master list, open invoices, and adjustments section, click the Template link 

next to Assets. 

The system either downloads the Assets.xls file or prompts you to open or save the file, 

depending on your browser’s settings. 

3. 
Open the Assets.xls file and fill in the required asset information: 

• 
ASSET_NAME: Type a descriptive name to identify the asset. 

• 
CATEGORY: Type the name of the asset class (on page 10) or asset category to 

associate with the asset. 

• 
TYPE: Type what kind of asset the asset is; for example, “Air conditioner,” “Ceiling fan,” 

“Clothes washer,” etc. 

---


<!-- Page 32 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

See the Asset types list in Accounts Payable to add and manage asset types. 

• 
LOCATION_ID: Type the ID of the property where the asset is located. 

• 
ASSET_COST: Type the original cost of the asset. 

• 
ACCT_NO: Type the G/L account number associated with the invoice. 

• 
FACILITIES_ASSET_ID: If the asset information that you are importing is from the 

Facilities application, type the asset ID from the Facilities application in this field. When 

there is an ID in this field, this tells the system that you are importing historical asset 

information into Accounting.  

4. 
Optionally, fill in additional information and invoice details associated with each asset: 

• 
SERIAL_NUMBER: Type the asset’s serial number. 

• 
MODEL_NUMBER: Type the asset’s model number. 

• 
WARRANTY_NUMBER: Type the asset’s warranty number. 

• 
IN_SERVICE_DATE: Type the date that the asset was placed in service. Typically, this is 

the date the asset began being used; it does not have to be the same as the purchase 

date. 

• 
WARRANTY_START_DATE: Type the date the asset’s warranty coverage begins. 

• 
WARRANTY_END_DATE: Type the date the asset’s warranty coverage expires. 

• 
OUT_OF_SERVICE_DATE: Type the date that the asset was disposed or taken out of 

service. 

• 
INVOICE_NO: Type the invoice number associated with the asset, if any. 

• 
INVOICE_DATE: Type the invoice date. 

• 
VENDOR_ID: Type the ID of the vendor from which the asset was purchased. 

• 
UNIT: Type the unit number where the asset is located. 

• 
DEPARTMENT_ID: Type the ID of the department associated with the asset.  

• 
SALVAGE_VALUE: Type the amount that the asset is estimated to be worth at the end 

of its useful life, when all depreciation is expensed. 

• 
DEPRECIATION_CONVENTION: Type when to start the asset’s depreciation schedule. 

Valid values include: 

• 
P: Start depreciating the asset the month that the asset is placed in service. If you 

leave this field blank, the schedule defaults to this option. 

• 
N: If the asset was placed in service between the 1st and the 15th of the month, 

then start depreciating the asset on the first day of that month. If the asset was 

placed in service between the 15th and the 31st of the month, then start 

depreciating the asset on the first day of the next month. 

• 
M: Always treat the asset as if it started in the middle of the quarter (the quarter 

is determined by the date it was placed in service). Mid-quarter depreciation 

---


<!-- Page 33 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

prevents the asset from exceeding its maximum depreciation for the year. This 

option is applicable only to assets whose asset book is set to depreciate assets on 

a Quarterly basis. Asset books are defined in the asset class (on page 11). 

• 
QUANTITY: Type the quantity of assets on the invoice. 

• 
CONDITION: Type the condition of the asset. Valid values include: 

• 
N: New 

• 
UG: Used/Good 

• 
UF: Used/Fair 

• 
UP: Used/Poor 

• 
DEPARTMENT: Type the name of the department associated with the asset. 

5. 
Optionally, fill in the opening balances for the financial and tax books associated with the 

asset: 

You can import only the books that match the asset class (on page 13 ). If you enter a date 
and amount for the Tax book but the asset class does not support the Tax book, then it will 
be ignored. Likewise, if you do not enter both the opening balance and the thru date, it will 
be ignored.  

• 
GENERAL_OPENING_BALANCE: Type the opening balance for the “General” asset 

book. 

• 
GENERAL_THRU_DATE: Type the date through which to set the opening balance for 

the “General” asset book. 

• 
TAX_OPENING BALANCE: Type the opening balance for the “Tax” asset book. 

• 
TAX_THRU_DATE: Type the date through which to set the opening balance for the 

“Tax” asset book. 

• 
OTHER1_OPENING_BALANCE: Type the opening balance for the “Other 1” asset book. 

• 
OTHER1_THRU_DATE: Type the date through which to set the opening balance for the 

“Other 1” asset book. 

• 
OTHER2_OPENING_BALANCE: Type the opening balance for the “Other 2” asset book. 

• 
OTHER2_THRU_DATE: Type the date through which to set the opening balance for the 

“Other 2” asset book. 

6. 
Save the template as a CSV file. 

Importing Data from the Template 

To import the template back into the system: 

1. 
On the Import data page, find the Set up A/P master list, open invoices, and adjustments 

section, and then click the Import link next to Assets. 

You can also click the Import assets button in the Asset information list. 

---



##### Viewing or Editing an Asset
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 34*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

The Import box opens. 

2. 
Click the Choose file button, and then select the CSV file that you filled with data.  

3. 
In the Date format drop-down list, select a format that matches the date format in your CSV 

file. 

4. 
Leave the File encoding option set to Auto detect unless you’re unable to import your file. 

Depending on your operating system, you may need to select a different type of file 

encoding. 

5. 
Select the Process offline check box to move on to other tasks while a large file uploads in 

the background. The system sends you an email when it completes the upload. 

6. 
In the Email results to this address field, enter your email address to receive a message with 

a list of data import errors or to get notified when the upload is complete. 

7. 
Click the Import button. 

Viewing or Editing an Asset 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets > View`



> **Navigation Path:** `Applications > Fixed Assets > All > Assets > Edit`


To view or edit an asset: 

1. 
In the Asset information list, find the asset that you want to view or edit, and then select the 

View or Edit link. 

The Asset information page opens. 

2. 
The actions you can take on this page are different depending on whether you are viewing 

or editing the record. 

• 
If you are in View mode, an additional section labeled Depreciation books appears in 

the Asset information tab that displays details about the life of the asset and its 

depreciation schedule. See Fields (on page 39) for a description of each field. 

• 
If you are in Edit mode, a third tab labeled Asset 

transfer/disposition/revaluation/reclass appears. From this tab, you can: 

• 
Transfer (on page 35) the asset to another location. 

• 
Dispose or partially dispose (on page 37) of the asset. 

• 
Reclass (on page 38) the asset to another account. 

3. 
Click Done or Save. 

---



##### Disposing of Assets in Bulk
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 35*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Disposing of Assets in Bulk 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets > Select > Bulk Disposal`


You can dispose of multiple assets in bulk if you are disposing of them for the same reason (sale, 

casualty loss, theft, etc.) and recording journal entries for the same disposal and proceeds 

accounts. 

To dispose of assets individually, see Disposing of an Asset (on page 37 ). 

Disposing of Assets in Bulk 

To dispose of assets in bulk: 

1. 
In the Asset information list, select the Select check box next to each asset you want to 

dispose of, and then click the Bulk disposal button. 

The Enter the disposal criteria box opens. 

2. 
In the Disposal date field, type or select the date on which you want to dispose of the 

assets. 

This date also serves as the G/L posting date for the corresponding disposal journal 
entries. 

3. 
In the Disposal type drop-down list, select the reason for disposal. 

4. 
In the Disposal account drop-down list, select the G/L account to record gains or losses 

resulting from asset disposal. 

5. 
In the Proceeds field, type the amount received from the sale of the assets, if any. 

6. 
In the Proceeds account drop-down list, select the G/L account to debit the amount of 

proceeds received from the sale of the assets. If there are no proceeds, then this field does 

not appear. 

7. 
Click the Dispose button. 

A confirmation box opens. 

8. 
Click OK to confirm and dispose of the assets. 

Viewing Disposed Assets 

When you dispose of an asset, the system removes the asset from the Asset information list, but 

the record is not deleted permanently. You can toggle the list to display all disposed or 

transferred assets (on page 35) as needed. 

To view disposed assets: 

1. 
In the Asset information list, select the Show disposed/transferred assets check box. 

The list displays only assets that have been disposed or transferred. 

---



##### Deleting an Asset
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 36*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

2. 
Clear the check box to return to the normal list view. 

Deleting an Asset 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets > Delete`


Deleting an asset permanently deletes the asset record from the system. If you are disposing of 
an asset from your company’s books, such as when the asset is sold or no longer in use, see 
Disposing of an Asset (on page 37 ). 

To delete an asset: 

1. 
In the Asset information list, find the asset record that you want to delete, and then select 

the Delete link. 

A delete confirmation message opens. 

2. 
Click OK to confirm. 

The asset is removed from the list. When you delete an asset either in Accounts Payable or 

Fixed Assets, the asset record is also retired in Facilities. 

After you post depreciation for an asset, the asset can longer be deleted. 

---



#### Asset Information Page
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 37*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset Information Page 


> **Navigation Path:** `Applications > Fixed Assets > All > 
 Assets`



> **Navigation Path:** `Applications > Fixed Assets > All > Assets > View/Edit`


Use the Asset information page to create, view, and modify asset records. 

This page includes the following tabs: 

• 
Asset information: This tab contains general information about the asset, including its 

name, asset class, property location, asset cost, and date placed in service. You can also 

track the asset’s depreciation history when you view the asset record. 

• 
Additional information: This tab contains supplemental information about the asset, 

including its invoice details, serial and model numbers, condition, and warranty details. 

• 
Asset transfer/disposition/revaluation/reclass: This tab is available only when you edit an 

asset. It contains options to transfer the asset to another property, dispose of (or partially 

dispose of) the asset when it is sold or no longer in use, and reclass the asset to another 

account. 

Asset Information Page - Add 

---


<!-- Page 38 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Information Page - Edit 

---


<!-- Page 39 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset Information Page - View 

---



##### Transferring an Asset to Another Location
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 40*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Transferring an Asset to Another Location 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets > Edit`


When you transfer an asset to a new location within your company, you will need to record the 

transfer from one account to another. 

Transferring an Asset 

To transfer an asset: 

1. 
In the Asset information list, find the desired asset record, and then select the Edit link. 

The Asset information page opens. 

2. 
Select the Asset transfer/disposition/revaluation/reclass tab. 

This tab is available only when you are editing an asset. 

3. 
In the Option field, select the Transfer option. 

4. 
In the Transfer from date field, type or select the date on which you are transferring the 

asset from the current location. 

5. 
In the Transfer to drop-down list, select the location to which you are transferring the asset. 

6. 
In the Proceeds field, type the amount of proceeds received from the transfer, if any. 

7. 
Fill in the G/L accounts section: 

• 
In the Transfer from gain/loss account drop-down list, select the account in which to 

record the original location’s gain or loss from the sale or transfer of the asset. 

• 
In the Transfer to gain/loss account drop-down list, select the account in which to 

record the new location’s gain or loss from the sale or transfer of the asset. 

• 
In the Transfer from proceeds account drop-down list, select the original location’s 

proceeds account. 

• 
In the Transfer to proceeds account drop-down list, select the new location’s 

proceeds account. 

If you did not enter any proceeds from the asset transfer in step 6, then the Transfer from 

proceeds account and Transfer to proceeds account fields do not appear. 

8. 
Click the Preview G/L entries button. 

The G/L entries to be generated section populates with a list of journal entries that will be 

recorded in the General Ledger when you transfer the asset. You can review and correct the 

accounts as needed. 

9. 
Click the Transfer asset button. 

A confirmation box opens. 

---



##### Disposing or Partially Disposing of an Asset
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 41*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

10. 
Click OK to confirm and transfer the asset. 

Viewing Transferred Assets 

When you transfer an asset to another location within your company, the system removes the 

asset from the Asset information list, but the record is not deleted permanently. You can toggle 

the list to display all transferred or disposed assets (on page 37) as needed. 

To view transferred assets: 

1. 
In the Asset information list, select the Show disposed/transferred assets check box. 

The list displays only assets that have been disposed or transferred. 

2. 
Clear the check box to return to the normal list view. 

Disposing or Partially Disposing of an Asset 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets > Edit`


You can dispose of an asset to remove it from your company’s account records or partially 

dispose of the asset and reduce its remaining value so that future depreciation calculates 

correctly. Typically, asset disposal results from one of the following events: 

• 
The asset is fully depreciated. 

• 
The asset is sold because it is no longer useful or needed. 

• 
The asset is no longer in use and has no resale value in the market. 

• 
The asset must be removed from the books due to unforeseen circumstances, such as theft, 

casualty, or condemnation. 

This topic pertains to individual asset disposal. To use the bulk disposal feature, see Disposing 
of Assets in Bulk (on page 31 ). 

Disposing of or Partially Disposing of an Asset 

To dispose of or partially dispose of an asset: 

1. 
In the Asset information list, find the desired asset record, and then select the Edit link. 

The Asset information page opens. 

2. 
Select the Asset transfer/disposition/revaluation/reclass tab. 

This tab is available only when you are editing an asset. 

3. 
In the Option field, select the Dispose/revalue option. 

4. 
In the Dispose date field, type or select the date on which you want to dispose of the asset. 

This date also serves as the G/L posting date for the related disposal journal entry. 

5. 
In the Disposal type drop-down list, select the reason for disposal. 

---


<!-- Page 42 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

6. 
In the Disposal/valuation amount field: 

• 
Type the full disposal amount if you are disposing of the entire asset. 

• 
Type the remaining value of the asset if you are partially disposing of the asset. 

7. 
In the Proceeds field, type the amount received from the sale of the asset, if any. 

8. 
In the G/L accounts section: 

• 
Select a G/L account from the Disposal gain/loss account drop-down list to record 

gains or losses from disposing of the asset. If the amount of the proceeds is greater 

than the book value of the asset at the time of the sale, then the difference is a “gain” 

on the sale or disposal. If the amount received is less than the book value, then the 

difference is a “loss” on the sale or disposal. 

• 
Select a G/L account from the Disposal proceeds account drop-down list to debit the 

amount of proceeds received from the sale of the asset. If there are no proceeds, then 

this field does not appear. 

9. 
Click the Preview G/L entries button. 

The G/L entries to be generated section populates with a list of journal entries that will be 

recorded in the General Ledger when you dispose of the asset. You can review and correct 

the accounts as needed. 

10. 
Click the Disposal of asset button. 

A confirmation box opens. 

11. 
Click OK to confirm and dispose of the asset. 

Viewing Disposed Assets 

When you dispose of an asset, the system removes the asset from the Asset information list, but 

the record is not deleted permanently. You can toggle the list to display all disposed or 

transferred assets (on page 35) as needed. 

To view disposed assets: 

1. 
In the Asset information list, select the Show disposed/transferred assets check box. 

The list displays only assets that have been disposed or transferred. 

2. 
Clear the check box to return to the normal list view. 

---



##### Reclassing an Asset to Another Account
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 43*



##### Fields
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 43*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Reclassing an Asset to Another Account 


> **Navigation Path:** `Applications > Fixed Assets > All > Assets > Edit`


You can reclass an asset to a different account. 

To reclass an asset: 

1. 
In the Asset information list, find the desired asset record, and then select the Edit link. 

The Asset information page opens. 

2. 
Select the Asset transfer/disposition/revaluation/reclass tab. 

This tab is available only when you are editing an asset. 

3. 
In the Option field, select the Reclass option. 

4. 
In the Reclass to account drop-down list, select the account to which you want to reclass 

the asset. 

5. 
Click the Reclass asset button. 

A confirmation box opens. 

6. 
Click OK to confirm. 

Fields 

Asset Information List 

Show 

disposed/transfer

red assets 

Select this check box to display only disposed or transferred assets. Clear the 

check box to return to the normal asset list view. 

Select 
Select this check box to select multiple assets for disposal, and then click the 

Bulk disposal button. 

Edit (link) 
Click this link to edit an asset. 

View (link) 
Click this link to view the details of an asset. 

Asset class 
This is the asset class associated with the asset. 

Asset name 
This is the name of the asset. 

Placed in service 
This is the date that the asset was placed in service. 

Cost 
This is the original cost of the asset. 

Location 
This is the property where the asset is located. 

---


<!-- Page 44 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Unit 
This is the unit where the asset is located. 

This field is defined only for assets created in the Accounts Payable 
application. The Asset information list in Fixed Assets automatically pulls 
in any assets from the Assets list in Accounts Payable. 

A/P invoice (link) Click this link to view the A/P invoice associated with the asset. 

G/L account 
This is the G/L account associated with the asset. 

Delete (link) 
Click this link to delete an asset. 

Asset Information List - Enter the Disposal Criteria Box 

Total assets for 

disposal 

This is the sum cost of all assets selected for disposal. 

Disposal date 
Type or select the date on which you want to dispose of the assets. 

Disposal type 
Select the reason for asset disposal. 

Disposal account Select the G/L account to record gains or losses resulting from asset sale or 

disposal. 

Proceeds 
Type the amount received from the sale of the assets, if any. 

Asset Information Page - Asset Information Tab 

Asset class 
Select an asset class to associate with the asset. The asset class determines 

the asset’s depreciation method and schedule. 

Property ID 
Select the property where the asset is located. 

Department ID 
Select a department to associate with the asset. 

Asset name 
Type a descriptive name to identify the asset. 

Asset cost 
Type the original cost of the asset. 

G/L account 
Select an account to associate with the asset. 

Type 
Select the asset type from the drop-down list. You can add and manage 

asset types from the Asset types list in the Accounts Payable application. 

Salvage value 
Type the amount that the asset is estimated to be worth at the end of its 

useful life, when all depreciation is expensed. 

Date placed in 

service 

Type or select the date that the asset began being used. This does not have 

to be the same as the purchase date. 

---


<!-- Page 45 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Depreciation 

convention 

Select when the asset’s depreciation schedule takes effect: 

• 
Full month: The asset starts depreciating on the first day of the 

month based on the date you entered in the Date placed in service 

field. 

• 
Mid month: If the Date placed in service falls during the first half of 

the month (1st through 15th), then the asset starts depreciating on 

the first day of the month. If the Date placed in service falls during 

the second half of the month (16th through 31st), then the asset 

starts depreciating on the first day of the next month. 

• 
Mid quarter: The asset is always treated as if it started in the middle 

of the quarter to prevent the asset from exceeding the maximum 

depreciation for the year. The first quarter of the schedule is 

determined by the Date placed in service; it will be calculated as a 

percentage of annual depreciation as follows: 

Q1 - 87.5% 

Q2 - 62.5% 

Q3 - 37.5% 

Q4 - 12.5% 

The Mid quarter option is applicable only to assets whose asset book is 
set up to depreciate assets on a Quarterly basis. Assets books are 
defined in the asset class (on page 11 ).  

Life of asset 

(periods) 

Type the number of periods over which the asset will depreciate. The length 

of a period is determined by your selection in the Depreciation convention 

field. For example, if you select Full month with 45 periods, the asset will 

depreciate over 45 months.  

Enter opening 

depreciation 

Select this check box to define opening depreciation for the asset, and then 

fill in the fields in the corresponding Asset books section. 

Asset Information Page - Asset Information Tab - Asset Books Section 

This section appears only when you select the Update opening depreciation check box. 

Book type 
This is the asset book type, either “General”, “Tax”, or “Other”. Asset books 

are defined in the asset class. 

Opening 

depreciation 

Type the asset’s starting depreciation amount. 

Opening 

depreciation thru 

Type or select the date through which the opening depreciation accrued. 

---


<!-- Page 46 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Information Page - Asset Information Tab - Depreciation Books 
Section 

This section appears only when you are viewing an asset, and only if you have defined the original 

Asset cost. 

Opening 

depreciation 

This is the asset’s opening depreciation amount. 

Life of asset 
This is the total number of periods that the asset is set to depreciate, as 

defined in its asset class. 

Prior depreciation This is the amount of depreciation that was posted to the General Ledger in 

the prior period. 

Posted 

depreciation 

This is the amount of depreciation that has been posted to the General 

Ledger. 

Accumulated 

depreciation 

This is the total amount of depreciation that has accrued since the asset was 

placed in service. 

Remaining 

depreciation 

This is the amount of depreciation that remains during the asset’s life. 

Depreciation date This is the date that the asset is scheduled to depreciate for each period. 

Depreciation 

percent 

This is the percent by which the asset depreciated during the depreciation 

period. 

Depreciation 

amount 

This is the amount by which the asset depreciated during the depreciation 

period. 

Status 
This displays whether or not the depreciation has posted to the General 

Ledger for the period. 

Date posted 
This is the date that the depreciation journal entries for the period posted to 

the General Ledger. 

G/L batch 
If the depreciation is posted to the General Ledger, click the View batch link 

to view a summary of the journal entry and its line items. 

Asset Information Page - Additional Information Tab - Invoice Information 
Section 

Vendor 
Select the vendor from which the asset was purchased. 

G/L account 
Select the account associated with the invoice. 

Invoice number 
Type the invoice number. 

Quantity 
Type the quantity of assets included on the invoice. 

---


<!-- Page 47 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Invoice date 
Type or select the A/P invoice date. 

Asset Information Page - Additional Information Tab - Additional 
Information Section 

Serial number 
Type the asset’s serial number. 

Model number 
Type the asset’s model number. 

Condition 
Select the current condition of the asset. 

Warranty number Type the asset’s warranty number. 

Warranty start 

date 

Type or select the date that the asset’s warranty begins. 

Warranty end 

date 

Type or select the date that the asset’s warranty expires. 

Asset Information Page - Asset Transfer/Disposition/Revaluation/Reclass 
Tab 

Option 
Select an option: 

• 
Transfer: Transfer an asset to another location. 

• 
Dispose/revalue: Either dispose of the full asset and remove it from 

your accounting records or partially dispose of the asset and reduce 

its remaining value so it depreciates correctly. 

• 
Reclass: Reclass the asset to another account. 

The remaining fields update depending on your selection. 

Transfer from 

date 

Type or select the date on which you are transferring the asset from the 

current location. 

This field appears only if you selected the Transfer option. 

Transfer to 
Select the location to which you are transferring the asset. 

This field appears only if you selected the Transfer option. 

Dispose date 
Type or select the date on which you are disposing of the asset. 

This field appears only if you selected the Dispose/revalue option. 

Disposal type 
Select the reason for asset disposal. 

This field appears only if you selected the Dispose/revalue option. 

---


<!-- Page 48 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Disposal/valuatio

n amount 

If you are disposing of the entire asset, then type the full disposal amount. 

If you are partially disposing of the asset, then type the asset’s remaining 

value. 

This field appears only if you selected the Dispose/revalue option. 

Proceeds 
Type the amount received from either the sale or transfer of the asset, if any. 

Asset Information Page - Asset Transfer/Disposition/Revaluation/Reclass 
Tab - G/L Accounts Section 

Transfer from 

gain/loss account 

Transfer to 

gain/loss account 

Select the original location’s gain or loss account and the new location’s gain 

or loss account from the drop-down lists. These accounts record the gains or 

losses from the sale or transfer of the asset. 

These fields appear only if you selected the Transfer option. 

Transfer from 

proceeds account 

Transfer to 

proceeds account 

Select the original location’s proceeds account and the new location’s 

proceeds account from the drop-down lists. These accounts debit the 

amount of proceeds received from the sale of the asset. 

These fields appear only if you selected the Transfer option, and only if you 
entered an amount in the Proceeds field. 

Disposal gain/loss 

account 

Select an account from the drop-down list to record gains or losses from 

disposing of the asset. If the amount of the proceeds is greater than the 

book value of the asset at the time of the sale, then the difference is a “gain” 

on the sale or disposal. If the amount received is less than the book value, 

then the difference is a “loss” on the sale or disposal. 

This field appears only if you selected the Dispose/revalue option. 

Disposal proceeds 

account 

Select an account from the drop-down list to debit the amount of proceeds 

received from the sale of the asset. 

This field appears only if you selected the Dispose/revalue option, and only 
if you entered an amount in the Proceeds field. 

Reclass to account Select the account to which you want to reclass the asset. 

This field appears only if you selected the Reclass option. 

Asset Information Page - Asset Transfer/Disposition/Revaluation/Reclass 
Tab - G/L Entries to Be Generated Section 

Account 
This is the account where the journal entry will be posted. 

---



##### Buttons
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 49*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Debit 
This is the debited amount. 

Credit 
This is the credited amount.  

Memo 
This is a description of the line entry.  

Buttons 

Asset Information List 

Add 
Opens the Asset information page with a blank record to create a new 

asset. 

Done 
Closes the list and returns to the Fixed Assets home page. 

Import assets 
Opens the Import box to import assets from a CSV template. 

Export 
Exports the records in the Asset information list to the selected file format: 

CSV, Excel, Word, or PDF. 

Bulk disposal 
Opens the Enter the disposal criteria box to dispose of assets in bulk. 

Asset Information List - Enter the Disposal Criteria Box 

Dispose 
Disposes of the selected assets. 

Cancel 
Closes the box without any changes. 

Asset Information Page 

Save 
Saves and closes the record. 

Cancel 
Closes the record and discards any changes. 

Print to... 
Generates a PDF file so that you can print it, or downloads the information in 

XML format. 

Edit 
If you are in View mode, click this button to switch to Edit mode. 

Duplicate 
If you are in View or Edit mode, click this button to copy the data from the 

current record to a new record of the same type. 

Done 
If you are in View mode, click this button to close the record and return to 

the previous page. 

More actions 
Click this drop-down arrow to display the following additional options: 

• 
Save & new: Saves the record and opens a new blank record. 

• 
View audit trail: Opens a log of changes to the record, including 

who made each change and when they made the change. 

---


<!-- Page 50 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Information Page - Asset Transfer/Disposition/Revaluation/Reclass 
Tab 

Preview G/L 

entries 

Populates a list of G/L journal entries that will be posted when you transfer 

or dispose of the asset. 

Transfer assets 
Transfers the assets. 

Disposal of asset 
Disposes of the assets. 

Reclass asset 
Reclasses the asset to the selected account. 

---



#### Draft Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 51*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Draft Assets 

This section describes how to activate assets that are captured from external processing systems, 

such as OpsTechnology. Draft assets are created when invoices that come into RealPage Financial 

Suite from the gateway (instead of being entered in the UI) are for an account defined as an asset 

account in one of your asset classes. 

---



#### Draft Assets List
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 52*



##### Before You Begin
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 52*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Draft Assets List 


> **Navigation Path:** `Applications > Fixed Assets > All > Draft Assets`


Use the Draft assets list to activate assets that are captured from invoices coming into RealPage 

Financial Suite from external systems, such as OpsTechnology. When you activate a draft asset, it 

is added to the Asset information list as a live asset. 

Before You Begin 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Permissions 

These permissions are required to add and manage assets: 

Application 
Activities/Lists 
Permissions 

Fixed Assets 
Asset Info 
List, View, Add, Edit, 

Delete 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

---



##### Activating Draft Assets
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 53*



##### Fields
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 53*



##### Buttons
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 53*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Activating Draft Assets 


> **Navigation Path:** `Applications > Fixed Assets > All > Draft Assets > Select > Activate Assets`


You can activate draft assets when needed to save them as live assets in the Asset information 

list. 

To activate draft assets: 

1. 
In the Draft assets list, select the Select check box next to the desired assets, and then click 

the Activate assets button. 

A confirmation box opens. 

2. 
Click OK to confirm. 

The system activates the assets and adds them to the Asset information list. 

Fields 

Draft Assets List 

Select 
Select this check box to select the draft assets that you want to activate, and 
then click the Activate assets button. The assets are saved as live assets in 
the Asset information list. 

Asset class 
This is the asset class associated with the asset. 

Asset name 
This is the name of the asset. 

Placed in service 
This is the date that the asset was placed in service. 

Cost 
This is the original cost of the asset. 

Location 
This is the property where the asset is located. 

Unit 
This is the unit where the asset is located. 

G/L account 
This is the G/L account associated with the asset. 

Buttons 

Draft Assets List 

Done 
Closes the list and returns to the Fixed Assets home page. 

Import assets 
Opens the Import box to import assets captured on invoices coming into 
RealPage Financial Suite from external invoice processing systems such as 
OpsTechnology. 

Export 
Exports the records in the Draft assets list to the selected file format: CSV, 
Excel, Word, or PDF. 

Activate assets 
Activates the selected assets and adds them to the Asset information list. 

---



#### Periodic Tasks
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 54*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Periodic Tasks 

This section describes how to use the menu options under the Periodic Tasks section of the All 

tab. 

---



#### Post Depreciation
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 55*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Post Depreciation 

When you add a new asset, RealPage Financial Suite automatically generates a depreciation 

schedule based on the field values defined in the asset class and asset record itself. These fields 

determine how to calculate depreciation for the asset and prompt the system to create 

depreciation journal entries for the remaining periods of the asset’s useful life. 

Each period—month, quarter, or year, depending on the frequency set in the asset class—you can 

post depreciation entries for one or more locations to the General Ledger. You can also preview 

and post depreciation for previous months for fixed assets that have not yet been depreciated. 

The system tracks depreciation entries in the Depreciation batches list. 

---



#### Depreciation Batches List
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 56*



##### Before You Begin
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 56*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Depreciation Batches List 


> **Navigation Path:** `Applications > Fixed Assets > All > Post Depreciation`


Use the Depreciation batches list to post depreciation journal entries for one or more locations to 

the General Ledger. After you post depreciation for a period, the system creates an individual G/L 

“batch” for each location and will include each asset for that location. Viewing a batch displays a 

summary of the journal entry and its line items.   

Before You Begin 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Permissions 

These permissions are required to add and manage depreciation batches: 

Application 
Activities/Lists 
Permissions 

Fixed Assets 
Asset Batches 
List, Delete 

If your user account doesn’t have the permissions shown above, then ask your System 

Administrator for assistance. If you have administrator privileges, you can assign permissions for a 

new feature to a user or to a role. See Roles and Permissions for a description of how to review a 

user’s permissions. 

---



##### Posting Depreciation Journal Entries
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 57*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Posting Depreciation Journal Entries 


> **Navigation Path:** `Applications > Fixed Assets > All > Post Depreciation > Post Depreciation > All 
Locations / Select Locations`


You can post depreciation for all assets each period, either for all locations or select locations. Use 

the Post depreciation button to select an option. 

Posting Depreciation Entries for All Locations 

To post depreciation for all locations: 

1. 
In the Depreciation batches list, click the Post depreciation button, and then select the All 

locations option. 

A set of fields and buttons appears at the top of the list. 

2. 
In the For depreciation date field, type or select the depreciation date. 

3. 
In the G/L posting date field, type or select the date that you want to post the depreciation 

entries to the General Ledger. 

4. 
In the Months to include drop-down list, select which months to include in the depreciation 

entries: 

• 
Selected depreciation months only: Posts depreciation for the month specified in the 

depreciation date. 

• 
Include prior months not yet depreciated: Posts depreciation for previous months for 

any fixed assets that have not yet been depreciated. For example, if you are posting 

depreciation in June and you see that someone has recently entered an asset with an 

in-service date of January 1, then you can post depreciation for every month leading 

up to and including June. 

Click the Preview prior months not depreciated button to view a report of any fixed 
assets that were not depreciated in previous months.  

5. 
In the Send completion notification to field, type the email address to which you want the 

system to send a notification email when it finishes posting the depreciation entries. This 

field automatically populates with the email address assigned to the active user. 

6. 
Click the Post all locations button. 

---


<!-- Page 58 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

The system places the depreciation entries in the offline queue for processing. When 

processing is complete, the system sends a notification email to the email recipient specified 

in step 4 and a new G/L batch appears in the Depreciation batches list for each location. 

Posting Depreciation Entries for Select Locations 

To post depreciation entries for one or more specific locations: 

1. 
In the Depreciation batches list, click the Post depreciation button, and then select the 

Select locations option. 

A set of fields and buttons appears at the top of the list. 

2. 
In the Locations to post field, select one or more locations for which you want to post 

depreciation entries. You can also post depreciation by location group.  

Use the Search field at the top of the drop-down list to quickly search for specific 
locations or location groups. 

3. 
In the For depreciation date field, type or select the depreciation date. 

4. 
In the G/L posting date field, type or select the date that you want to post the depreciation 

entries to the General Ledger. 

5. 
In the Months to include drop-down list, select which months to include in the depreciation 

entries: 

• 
Selected depreciation months only: Posts depreciation for the month specified in the 

For depreciation date. 

• 
Include prior months not yet depreciated: Posts depreciation for previous months for 

any fixed assets that have not yet been depreciated. For example, if you are posting 

depreciation in June and, unbeknownst to you, someone has entered an asset with an 

in-service date of January 1, then you can post depreciation for every month leading 

up to and including June. 

Click the Preview prior months not depreciated button to view a report of any fixed 
assets that were not depreciated in previous months. The report includes only 
assets from the selected locations. 

---



##### Previewing Assets Not Depreciated in Prior Months
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 59*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

6. 
In the Send completion notification to field, type the email address to which you want the 

system to send a notification email when it finishes posting the depreciation entries. This 

field automatically populates with the email address assigned to the active user. 

7. 
Click the Post selected locations button. 

The system places the depreciation entries in the offline queue for processing. When 

processing is complete, the system sends a notification email to the email recipient specified 

in step 4, and a new G/L batch appears in the Depreciation batches list for each location. 

Previewing Assets Not Depreciated in Prior Months 


> **Navigation Path:** `Applications > Fixed Assets > All > Periodic Tasks > Post Depreciation > Post 
Depreciation > All Locations / Select Locations > Preview Prior Months Not 
Depreciated`


If you have a fixed asset whose depreciation was not posted to the General Ledger during 

previous months, then you can include it the next time you post depreciation. This could happen 

if someone enters a new asset with an in-service date from earlier in the year. For example, if you 

are posting depreciation for June, but an asset was recently added with an in-service date of 

January 1, then you might need to depreciate the asset for all months leading up to and including 

June. 

You can preview a list of fixed assets that were not depreciated during previous months before 

posting depreciation (on page 52) to the General Ledger. To do this: 

1. 
In the Depreciation batches list, click the Post depreciation button, and then select the All 

locations or Select locations option. 

2. 
If you selected Select locations, then select one or more locations from the Locations to 

post drop-down list. 

3. 
In the For depreciation date field, type or select the depreciation date. 

4. 
Click the Preview prior months not depreciated button. 

The system generates a PDF report previewing any fixed asset depreciation from previous 

months that would be included if you posted depreciation. Review the report and decide 

whether to post the depreciation with the current depreciation batch. 

---



##### Viewing Depreciation Batches
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 60*



##### Deleting Depreciation Batches
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 60*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Viewing Depreciation Batches 


> **Navigation Path:** `Applications > Fixed Assets > All > Post Depreciation > View Batch`


To view a batch of depreciation entries posted to the General Ledger: 

• 
In the Depreciation batches list, find the desired G/L batch, and then select the View batch 

link. 

The Journal entries page opens with a summary of the journal entry and its line items. 

See Journal Entries Page for more information about this page’s tabs and fields.  

Deleting Depreciation Batches 


> **Navigation Path:** `Applications > Fixed Assets > All > Post Depreciation > Delete > Delete`


To delete one or more G/L batches: 

1. 
In the Depreciation batches list, select the Delete check box next to the desired G/L 

batch(es). 

2. 
Click the Delete button. 

A confirmation box opens. 

3. 
Click OK to confirm. 

---



##### Fields
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 61*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Fields 

Depreciation Batches List - Columns 

Location ID 
This is the unique location ID. 

Location name 
This is the location name. 

Book type 
This is the asset book type associated with the depreciation schedule. 

Depreciation date This is the depreciation date for the period. 

Date posted 
This is the date that the system posts the depreciation entries to the General 

Ledger. 

G/L batch 
Select the View batch link to open the Journal entries page and view a 

summary of the depreciation journal entry and line items. 

Delete 
Select this check box next to each G/L batch that you want to delete, and 

then click the Delete button. 

Depreciation Batches List - Filters 

3 months 

depreciation 

Displays all depreciation batches posted within the last three months. 

Prior month 

depreciation 

Displays all depreciation batches posted for the prior month. 

Current month 

depreciation 

Displays all depreciation batches posted for the current month. 

Depreciation Batches List - Post Depreciation 

Locations to post Select one or more locations for which you want to post depreciation. You 

can also post deprecation by location group. 

This field appears only if you chose Select locations from the Post 

depreciation drop-down list. 

For depreciation 

date 

Type or select the depreciation date for the period. 

G/L posting date 
Type or select the date that you want to post depreciation to the General 

Ledger. 

---



##### Buttons
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 62*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Months to include Select which months to post depreciation for: 

• 
Selected depreciation month only: Posts only depreciation for the 

month specified in the For depreciation date. For example, a 

depreciation date of 6/1 would post depreciation for the month of 

June. 

• 
Include prior months not yet depreciated: Posts depreciation for 

the month specified in the For depreciation date, but also posts 

depreciation for previous months for any fixed assets that have not 

been depreciated. For example, if you are posting depreciation in 

June and, unbeknownst to you, someone has entered an asset with 

an in-service date of January 1, then you can post depreciation for 

every month leading up to and including June. 

Click the Preview prior months not depreciated button to view a report of 
any fixed assets that were not depreciated in previous months. 

Send completion 

notification to 

Type the email address to which you want the system to send a notification 

email when depreciation finishes posting. 

Buttons 

Depreciation Batches List 

Delete 
Deletes the selected G/L batches. 

Post depreciation Select whether you want to post depreciation for All locations or Select 

locations, and then fill in the corresponding fields. 

Done 
Closes the list and returns to the Fixed Assets home page. 

Export 
Exports the records in the Depreciation batches list to the selected file 

format: CSV, Excel, Word, or PDF. 

Depreciation Batches List - Post Depreciation 

Post all locations 

Post selected 

locations 

Posts the depreciation journal entries to the General Ledger for all locations 

or individually selected locations. 

---


<!-- Page 63 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Preview prior 

months not 

depreciated 

Generates a PDF report to view any fixed asset depreciation that was not 

posted in previous months leading up to the For depreciation date.  

These depreciation amounts will be posted to the General Ledger if you 

select the Include prior months not yet depreciated option from the 

Months to include drop-down list. For example, if you are posting 

depreciation in June and, unbeknownst to you, someone has entered an 

asset with an in-service date of January 1, then you can post depreciation for 

every month leading up to and including June. 

Cancel 
Cancels the depreciation entries and hides the Post depreciation fields. 

---



#### Reports
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 64*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Reports 

This section describes how to use the menu options under the Reports section of the All tab. 

---



#### Asset Info Reports
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 65*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset Info Reports 


> **Navigation Path:** `Applications > Fixed Assets > All > Asset Info Reports`


Use the Asset report page to set up and run the following asset information reports: 

• 
Accumulated Depreciation 

• 
Asset Disposal 

• 
Asset Activity 

• 
Asset List 

For each of these report types, you can generate a detail or summary report view and sort the 

data by location and asset class, in either order. 

Accumulated Depreciation Report 

This report displays a high-level view of the assets in each location, their depreciation schedules, 

and their accumulated depreciation amounts, including their beginning, current, ending, 

year-to-date (YTD), total, and remaining depreciation. 

---


<!-- Page 66 -->
Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Disposal Report 

This report displays a list of disposed assets with their accumulated depreciation, net proceeds, 

and gain or loss amount. 

Asset Activity Report 

This report displays a list of assets and any activities on them, such as acquisitions, transfers in or 

out, and dispositions. 

---



##### Before You Begin
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 67*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset List 

This report displays a list of assets and their depreciation schedules. 

Before You Begin 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Permissions 

These permissions are required to run asset info reports: 

Application 
Reports 
Permissions 

Fixed Assets 
Asset Info Report 
Run 

If your user account doesn’t have the permissions shown above, then ask your System 

Administrator for assistance. If you have administrator privileges, you can assign permissions for a 

new feature to a user or to a role. See Roles and Permissions for a description of how to review a 

user’s permissions. 

---



##### Customizing and Running Asset Info Reports
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 68*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Customizing and Running Asset Info Reports 


> **Navigation Path:** `Applications > Fixed Assets > All > Asset Info Reports`


To set up and run the Accumulated Depreciation, Asset Disposal, Asset Activity, or Asset List report: 

1. 
In the Applications menu, select Fixed Assets, and then select the All tab. 

2. 
In the Reports section, select the Asset info reports option. 

The Asset report page opens for you to define your report type and report parameters. 

Filling in the Time Period Section 

Define the date range for the report: 

1. 
In the Start date field, type or select the date on which you want report coverage to begin. 

2. 
In the End date field, type or select the date on which you want report coverage to end. 

Type “p” in a date field to automatically insert the last day of the prior month. See Specifying 
Dates in Getting Started for a full list of shortcut keys related to entering dates. 

Filling in the Options Section 

Define the report options: 

1. 
In the Report type drop-down list, select the type of report that you want to generate. 

• 
Accumulated Depreciation: Displays a high-level view of the assets in each location, 

their depreciation schedules, and their accumulated depreciation amounts, including 

their beginning, current, ending, year-to-date (YTD), total, and remaining depreciation. 

• 
Asset Disposal: Displays a list of disposed assets with their accumulated depreciation, 

net proceeds, and gain or loss amount. 

• 
Asset Activity: Displays a list of assets and any activities on them, such as acquisitions, 

transfers in or out, and dispositions. 

• 
Asset List: Displays a list of assets and their depreciation schedules. 

2. 
In the Detail/summary drop-down list, select a report format: 

• 
Detail: Displays the details of each asset as an individual row. 

• 
Summary: Groups the asset details by location or asset class, depending on the sort 

order. 

3. 
In the Sort order drop-down list, select how you want to sort the report data: 

• 
Location->Class: Sorts the report by location first and asset class second. The location 

is the parent row, and the asset class is a child row nested under it. 

• 
Class->Location: Sorts the report by asset class first and location second. The asset 

class is the parent row, and the location is a child row nested under it. 

---


<!-- Page 69 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

4. 
In the Columns to hide drop-down list, select one or more default columns that you want to 

hide from the report. 

5. 
In the Placed in service option drop-down list, select whether you would like to include or 

exclude assets that have not yet been placed in service: 

• 
Include assets with no placed in service date: Select this option to include assets in 

the report even if there isn’t a placed in service date in the asset record. 

• 
Include assets with no placed in service date or a future placed in service date: 

Select this option to include assets in the report even if there isn’t a placed in service 

date in the asset record or if the placed in service date is a future date. 

• 
Exclude assets not placed in service: Select this option to exclude assets from the 

report if they have not been placed in service. 

6. 
If you do not want the report to show header-level rows for the names or totals of 

properties or asset classes, then select the Suppress titles and totals check box. This option 

applies only to detail reports. 

Filling in the Filters Section 

Define additional filters for the report: 

1. 
In the Book field, select the asset book type for which you are reporting; for example, 

“General” or “Tax”. 

2. 
In the Location field, select the locations or location groups for which you are reporting 

assets. If you want the report to include all locations, then leave this field blank (or choose 

Select All). 

3. 
In the Asset class field, select the asset class for which you are reporting assets. If you want 

the report to include all asset classes, then leave this field blank. 

Running the Report 

After you define the report parameters, click the View button to run the report in RealPage 

Financial Suite, click the Print button to generate the report as a printable PDF, or click the Export 

button to export the report to an Excel file. 

---



##### Asset Info Report Columns
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 70*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset Info Report Columns 

Column headers in Fixed Assets reports are frozen to help you keep track of information as you 

scroll down the report. 

Accumulated Depreciation Report Columns 

Location 
This is the property where the asset is located. 

Asset class 
This is the asset class associated with the asset. 

Account 
This is the G/L account number associated with the asset. 

Department 
This is the department associated with the asset. 

Asset name 
This is the name of the asset. 

Unit 
This is the unit associated with the asset. 

Asset cost 
This is the original cost of the asset. 

Method 
This is the method that the system uses to calculate depreciation. 

Depreciation methods are abbreviated in the report as follows: 

• 
SL: Straight Line 

• 
DB100: Declining Balance (100) 

• 
DB150: Declining Balance (150) 

• 
DB200: Double Declining Balance (200) 

• 
SUM: Sum of Years Digits. 

Frequency 
This is the rate at which the asset depreciates over one full period, either 

Monthly, Quarterly, or Yearly. 

Placed in service 
This is the date that the asset was placed in service.  

Life in years 
This is the life of the asset in years. For example, if the asset depreciates 

monthly over 12 periods, then the Life in years would be 1. 

Beginning 

depreciation 

This is the depreciation at the report’s start date. 

Current 

depreciation 

This is the depreciation for the date range specified in the report. 

Ending 

depreciation 

This is the Beginning depreciation plus the Current depreciation. 

YTD depreciation This is the depreciation that has accrued since the beginning of the year of 

the report’s end date. 

Total depreciation This is the total depreciation within the reported date range. 

---


<!-- Page 71 -->
Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Remaining 

depreciation 

This is the amount of depreciation remaining in the asset’s life. 

Asset Disposal Report Columns 

Location 
This is the property where the asset is located. 

Asset class 
This is the asset class associated with the asset. 

Account 
This is the G/L account number associated with the account. 

Department 
This is the department associated with the asset. 

Asset name 
This is the name of the asset. 

Asset cost 
This is the original cost of the asset. 

Placed in service 
This is the date on which the asset was placed in service. 

Accumulated 

depreciation 

This is the total depreciation that has accumulated up to this point in the 

asset’s life. 

Net proceeds 
These are the net proceeds received from the sale or disposal of the asset. 

Gain/loss 
This is the asset’s book value (original cost minus accumulated depreciation) 

subtracted from the sale price of the asset. If the remainder is positive, then 

it is a gain. If the remainder is negative, then it is a loss. 

Disposal date 
This is the asset disposal date. 

Asset Activity Report Columns 

Location 
This is the property where the asset is located. 

Asset class 
This is the asset class associated with the asset. 

Account 
This is the G/L account number associated with the account. 

Department 
This is the department associated with the asset. 

Asset name 
This is the name of the asset. 

Beginning cost 
This is the original asset cost. 

Placed in service 
This is the date on which the asset was placed in service. 

Acquisitions 
This is the amount of any acquisitions. 

Transfers in 
This is the amount of any transfers in. 

Transfers out 
This is the amount of any transfers out. 

Dispositions 
This is the amount of any dispositions. 

Ending cost 
This is the original cost minus the amounts for acquisitions, transfers in and 

out, and dispositions. 

---



##### Buttons
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 72*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Asset List Report Columns 

Location 
This is the property where the asset is located. 

Asset class 
This is the asset class associated with the asset. 

Account 
This is the G/L account number associated with the account. 

Department 
This is the department associated with the asset. 

Asset name 
This is the name of the asset. 

Unit 
This is the unit associated with the asset. 

Asset cost 
This is the original cost of the asset. 

Method 
This is the method that the system uses to calculate depreciation. 

Depreciation methods are abbreviated in the report as follows: 

• 
SL: Straight Line 

• 
DB100: Declining Balance (100) 

• 
DB150: Declining Balance (150) 

• 
DB200: Double Declining Balance (200) 

• 
SUM: Sum of Years Digits. 

Frequency 
This is the rate at which the asset depreciates over one full period, either 

Monthly, Quarterly, or Yearly. 

Placed in service 
This is the date that the asset was placed in service. 

Life in years 
This is the life of the asset in years. For example, if the asset depreciates 

monthly over 12 periods, then the Life in years would be 1. 

Buttons 

Asset Report Page 

Customize 
Opens the report’s customization page to change filters and time periods, 

and to exclude specific types of data. 

The Customize button appears only after viewing the report. 

View 
Opens the report in your browser. 

Print 
Displays the report in printable PDF format so you can print it or save it on 

your computer. 

Export 
Exports the report to a separate file that you can then distribute or save on 

your computer. File formats to which you can export the report data vary 

among reports. 

---



#### Asset Reconciliation Report
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 73*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Asset Reconciliation Report 


> **Navigation Path:** `Applications > Fixed Assets > All > Asset Reconciliation Report`


Use the Asset Reconciliation report to compare your asset balances and G/L balances and verify 

that they agree. Reconciling your fixed assets on a regular basis is important for accurate 

bookkeeping; it ensures that you have appropriately recorded asset depreciation, accounted for 

any new assets, and properly disposed of assets that were sold, eliminated, or retired. 

---



##### Before You Begin
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 74*



##### Customizing and Running the Asset Reconciliation Report
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 74*

Using Fixed Assets 

RealPage® Financial Suite Fixed Assets User Guide 
© 2026 RealPage, Inc. 

Before You Begin 

Access can vary depending on your organization’s subscriptions and your permissions. If you do 

not see the option in the menu, then ask your System Administrator to check your permissions. 

Permissions 

These permissions are required to run the Asset Reconciliation report: 

Application 
Reports 
Permissions 

Fixed Assets 
Asset Reconciliation 

Report 

Run 

If your user account doesn’t have the permissions shown above, then ask your System 

Administrator for assistance. If you have administrator privileges, you can assign permissions for a 

new feature to a user or to a role. See Roles and Permissions for a description of how to review a 

user’s permissions. 

Customizing and Running the Asset Reconciliation Report 


> **Navigation Path:** `Applications > Fixed Assets > All > Asset Reconciliation Report`


To set up and run the Asset Reconciliation report: 

1. 
In the Applications menu, select Fixed Assets, and then select the All tab. 

2. 
In the Reports section, select the Asset reconciliation report option. 

The Asset reconciliation report page opens for you to define the report parameters. 

Filling in the Time Period Section 

Define the date range for the report: 

1. 
In the Start date field, type or select the date on which you want report coverage to begin. 

2. 
In the End date field, type or select the date on which you want report coverage to end. 

Type “p” in a date field to automatically insert the last day of the prior month. See 
Specifying Dates in Getting Started for a full list of shortcut keys related to entering dates. 
Filling in the Filters Section 

Define additional filters for the report: 

1. 
In the Book field, select the asset book type for which you are reporting; for example, 

“General” or “Tax”. 

2. 
In the Property field, select the location for which you are reporting assets. If you want the 

report to include all locations, then leave this field blank. 

---



##### Asset Reconciliation Report Columns
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 75*



##### Buttons
*Source: `RP Financial Suite Fixed Assets User Guide.pdf`, Page 75*

Chapter 3: Using Fixed Assets 

© 2026 RealPage, Inc. 
RealPage® Financial Suite Fixed Assets User Guide 

Running the Report 

After you define the report parameters, click the View button to run the report in RealPage 

Financial Suite, click the Print button to generate the report as a printable PDF, or click the Export 

button to export the report to an Excel file. 

Asset Reconciliation Report Columns 

Column headers in Fixed Assets reports are frozen to help you keep track of information as you 

scroll down the report. 

Asset Reconciliation Report Columns 

G/L account 
This is the G/L account associated with the fixed asset(s). 

Location 
This is the location associated with the fixed asset(s). 

Asset balances 
This is the total asset balance amount. 

G/L balances 
This is the G/L balance amount. 

Difference 
This is the difference between the asset balance and G/L balance. If both 

balances are in agreement, then the difference is zero.  

Buttons 

Asset Reconciliation Report Page 

Customize 
Opens the report’s customization page to change filters and time periods, 

and to exclude specific types of data. 

The Customize button appears only after viewing the report. 

View 
Opens the report in your browser. 

Print 
Displays the report in printable PDF format so you can print it or save it on 

your computer. 

Export 
Exports the report to a separate file that you can then distribute or save on 

your computer. File formats to which you can export the report data vary 

among reports. 


# MANUAL: RP Financial Suite Fixed Assets QS.pdf



## QS Header
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*



### About the Fixed Assets Application
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*



### Setting Up Asset Classes
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*



### Adding a New Asset
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*



### Disposing or Partially Disposing of an Asset
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*



### Disposing of Assets in Bulk
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*



### Transferring an Asset
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 1*

Q

S

H

e

a

d

e

r

About the Fixed Assets Application

Fixed Assets is a comprehensive asset management solution
suited for businesses and organizations of any size. With this
application, you can:

▪
Manage asset acquisition, depreciation, and disposal from one
central location.
▪
Automate depreciation through recurring journal entries.
▪
Track asset information such as insurance, warranties, and
maintenance logs.

Setting Up Asset Classes

1. In Fixed Assets, select the Setup tab, and then select 
Asset classes.
2. Type a name for the Asset class.
3. Type a Description for the asset class.
4. Select one or more Accounts to associate with the asset class.
5. Select a Book type for the asset, such as "General" or "Tax".
6. Select the Journal to which the system should post
depreciation journal entries.
7. Select the Method for calculating depreciation.
8. Select the Frequency at which to depreciate assets over one
full period.
9. Type the number of Periods that the asset will depreciate.
10. Select an Accumulated depreciation account to be credited
when the system posts depreciation.
11. Select a Depreciation expense account to be debited when
the system posts depreciation.
12. Click Save.

Adding a New Asset

1. In Fixed Assets, select the All tab, and then select 
 Assets.
2. Select an Asset class for the asset.
3. Select the Property ID where the asset is located.
4. Optionally, select a Department ID to associate with the asset.
5. Type an Asset name.
6. Type the original Asset cost.
7. Select a G/L account to associate with the asset.
8. Type the Salvage value, the amount you estimate the asset to
be worth after all depreciation is expensed.
9. In the Date placed in service field, type or select the date that
the asset began being used. This does not have to be the same
as the purchase date.
10. In the Depreciation convention drop-down list, select when the
asset's depreciation schedule should start.

11. Select the Enter opening depreciation check box to enter
opening depreciation for the asset, and then fill in the following
fields:

▪
Opening depreciation: Type the asset's starting
depreciation amount.
▪
Opening depreciation thru: Type or select the date
through which the opening depreciation accrued.

12. Select the Additional information tab.
13. Fill in the Invoice information section:

▪
Vendor: Select the vendor from which the asset was
purchased.
▪
G/L account: Select the account associated with the
invoice.
▪
Invoice number: Type the invoice number.
▪
Quantity: Type the quantity of assets on the invoice.
▪
Invoice date: Type or select the A/P invoice date.

14. Fill in the Additional information section:

▪
Serial number: Type the asset's serial number.
▪
Model number: Type the asset's model number.
▪
Condition: Select the asset's current condition.
▪
Warranty number: Type the asset's warranty number.
▪
Warranty start date: Type the warranty's start date.
▪
Warranty end date: Type the warranty's expiration date.

15. Click Save.

Disposing or Partially Disposing of an Asset

1. In Fixed Assets, select the All tab, and then select Assets.
2. Click Edit next to the asset you want to dispose.
3. Select the Asset transfer/disposition/revaluation/reclass tab.
4. Select the Dispose/revalue option.
5. Type or select the Disposal date.
6. Select the Disposal type.
7. Type the Disposal/valuation amount.
8. Type the amount of Proceeds received from the sale of the
asset, if any.
9. In the G/L accounts section, select the following accounts:

▪
Disposal gain/loss account: Select the account to record
gains or losses resulting from asset disposal.
▪
Disposal proceeds account: Select the account to debit
the amount of proceeds received from the sale of the asset.
This field appears only if there are proceeds.

10. Click the Preview G/L entries button to preview a list of G/L
journal entries for the asset disposal.
11. Click the Disposal of asset button.
12. Click OK.

Disposing of Assets in Bulk

1. In Fixed Assets, select the All tab, and then select Assets.
2. Select the assets you want to dispose of.
3. Click the Bulk disposal button.
4. Type or select the Disposal date.
5. Select the Disposal type.
6. Select the Disposal account to record gains or losses resulting
from asset disposal.
7. Type the amount of Proceeds received from the sale of the
assets, if any.
8. Select the Proceeds account to debit the amount of proceeds
received from the sale of the assets. This field appears only if
there are proceeds.
9. Click the Dispose button.
10. Click OK.

Transferring an Asset

When you transfer an asset to a new location within your
company, you will need to record the transfer from one account
to another.

1. In Fixed Assets, select the All tab, and then select Assets.
2. Click Edit next to the asset you are transferring.
3. Select the Asset transfer/disposition/revaluation/reclass tab.
4. Select the Transfer option.
5. In the Transfer from date field, type or select the date on which
you are transferring the asset from its current location.
6. In the Transfer to drop-down list, select the location to which
you are transferring the asset.
7. Type the amount of Proceeds received from the transfer, if any.
8. Fill in the G/L accounts section:

▪
Transfer from gain/loss account: Select the account to
record the original location's gains or losses from the sale
or transfer of asset.
▪
Transfer to gain/loss account: Select the account to
record the new location's gains or losses from the sale or
transfer of the asset.
▪
Transfer from proceeds account: Select the original
location's proceeds account. This field appears only if there
are proceeds.
▪
Transfer to proceeds account: Select the new location's
proceeds account. This field appears only if there are
proceeds.

9. Click the Preview G/L entries button to preview a list of G/L
journal entries for the asset transfer.
10. Click the Transfer asset button.
11. Click OK.

RealPage Financial Suite Fixed Assets Quick Steps

RealPage Financial Suite Fixed Assets Quick Steps Guide

Doc ID: 311246

9/12/2024

This document and the policies and procedures contained herein are the confidential and proprietary information of RealPage, Inc. This document may not be copied,

distributed, or otherwise disclosed outside of RealPage facilities, and may not be used in any way unless expressly authorized by RealPage.

---



### Reclassing an Asset
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 2*



### Activating Draft Assets
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 2*



### Posting Depreciation
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 2*



### Running Asset Info Reports
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 2*



### Running the Asset Reconciliation Report
*Source: `RP Financial Suite Fixed Assets QS.pdf`, Page 2*

Reclassing an Asset

1. In Fixed Assets, select the All tab, and then select Assets.
2. Click Edit next to the asset.
3. Select the Asset transfer/disposition/revaluation/reclass tab.
4. Select the Reclass option.
5. In Reclass to account, select the account to which you are
reclassing the asset.
6. Click the Reclass asset button.

Activating Draft Assets

Use the Draft assets list to activate assets that are captured
from invoices coming into RealPage Financial Suite from
external systems, such as OpsTechnology. When you activate
a draft asset, it is added to the Asset information list as a live
asset.

1. In Fixed Assets, select the All tab, and then select Draft
assets.
2. Select the assets that you want to activate.
3. Click the Activate assets button.
4. Click OK.

Posting Depreciation

RealPage Financial Suite automatically generates a
depreciation schedule based on the asset and asset class
settings. Each period, you can post depreciation entries for one
or more locations to the General Ledger.

1. In Fixed Assets, select the All tab, and then select Post
depreciation.
2. Click the Post depreciation button.
3. Select whether you are posting depreciation for All locations or
Select locations.
4. If you selected Select locations, then select one or more
Locations to post.
5. Type or select a depreciation date.
6. Type or select the date to post depreciation entries to the
General Ledger.
7. Select which Months to include in the depreciation batch:

▪
Selected depreciation month only
▪
Include prior months not yet depreciated

Click Preview prior months not depreciated to preview
any fixed asset depreciation that was not posted in prior
months.

8. In the Send completion notification to field, type the email
address that the system should notify when it posts the
depreciation entries.
9. Click the Post all locations or Post selected locations button.

Running Asset Info Reports

1. In Fixed Assets, select the All tab, and then select Asset info
reports.
2. Type a Start date and End date for the report.
3. Select a Report type:

▪
Accumulated Depreciation
▪
Asset Disposal
▪
Asset Activity
▪
Asset List

4. Select a report format:

▪
Detail: Displays the details of each asset as an individual
row.
▪
Summary: Groups the asset details by location or asset
class, depending on the sort order.

5. Select a Sort order for the report data:

▪
Location->Class: Sorts the report first by location, then by
asset class.
▪
Class->Location: Sorts the report first by asset class, then
by location.

6. Optionally, select one or more Columns to hide from the report.
7. Select whether to include or exclude assets that have not yet
been placed in service.
8. Define additional filters for the report:

▪
Book: Select the asset book type to report on.
▪
Property: Select the location to report on.
▪
Asset class: Select the asset class to report on.

9. Click View to run the report directly within RealPage Financial
Suite, Print to generate the report as a PDF, or Export to export
the report to Excel.

Running the Asset Reconciliation Report

1. In Fixed Assets, select the All tab, and then select Asset
reconciliation report.
2. Type a Start date and End date for the report.
3. In Book, select the asset book type to report on.
4. In Property, select the location to report on.
5. In Opening balance option, select how to calculate Total
depreciation.

▪
Calculate opening balance: Calculates the total of all
periods marked as prior or posted.
▪
Use existing balance: Calculates the original opening
balance plus all periods marked as posted.

6. Click View to run the report directly within RealPage Financial
Suite, Print to generate the report as a PDF, or Export to export
the report to Excel.

RealPage Financial Suite Fixed Assets Quick Steps

RealPage Financial Suite Fixed Assets Quick Steps Guide

Doc ID: 311246

9/12/2024