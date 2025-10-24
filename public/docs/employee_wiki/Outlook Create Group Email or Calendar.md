---
dg-publish: true
tags:
  - calendar
  - group
  - collaberation
  - shared
  - share
  - multi
  - user
---
Creating a group makes for easy shared calendar and multi email features.

> [!tip] Creating Events
> If you're unfamiliar working with multiple calendars (personal and group), check out [[L150/tutorials/Creating Calendar Events|Creating Calendar Events]]

> [!warning] MacOs vs Windows
> The Outlook app on MacOs does not have the ribbon toolbar like on Windows. I did not find an option to create "Groups" or even to view them
> 
## Create a Group
1. Find ==New Group== button or Search for "create group"
![[attachments/outlook-group-create-1.jpg]]
2. Create Group Form is self explanatory
3. Add Members Form is self explanatory (no need to add yourself. You will be added automatically)
4. In Outlook, under the Calendar tab find your automatically created under "All Group Calendars". This example I've created Groups **Countryside Banquet Hall Events**
![[attachments/outlook-group-create-2.jpg]]
## Share or Export Calendar
Let's say you have a personal calendar or another calendar shared by a coworker that you want to convert to a *Group Calendar*.
1. Right click over the Calendar Name you'd like to export
2. Click `Share...` menu item
> [!warning] 10 Year Max
> If the calendar has events that span over more than *10 years* you will need to make a custom time range that is under 10 years. If you want to preserve all events, then you will need to do batch imports of 10 or less years
3. Export and it will immediately start you with a draft email to send off to your coworker
## Import or Migrate Events into Group Calendar
1. On the recipient side, You will receive an email saying "Add Calendar"
2. Make sure to **IMPORT AS NEW**. A regular import will add all events to your personal calendar.
3. Back to "My Calendars" highlight the imported calendar
4. Change the view to **List** view 
![[attachments/outlook-group-create-3.jpg]]
### 5. In list view you can now select all events via `ctrl + a` and highlight in *light blue*
![[attachments/outlook-group-create-4.jpg]]
6. In this example we are migrating events from personal calendar **Countryside Banquet Hall OLD** -> Group Calendar **Countryside Banquet Hall Events**
### 7. When clicking into the group calendar **Countryside Banquet Hall Events** you may need to change the view to **List** again
![[attachments/outlook-empty calendar list before paste.jpg]]
8. Here click once into the blank grey space and paste the events `ctrl + p`
## Troubleshooting
### Calendar import not showing in My Calendars

> [!error] Windows Calendar Import
> When importing calendar shared via email I hit the "Import as New". I wanted to start over so I deleted that calendar and tried to import the same calendar (with newer events added). 
> 
> This would result in the import not showing in my list of **My Calendars** even though the import was *successful*. I believe this is because it is still hiding the calendar in the ==trash== because they have the same name. I ended up importing the calendar `.ics` via the **Outlook Web App** instead

This was the most convoluted way to get this to work... No surprises here #windows 
1. Export calendar from source Cal (Windows Desktop Outlook)
2. Import calendar into destination Cal [Outlook Web App](https://outlook.office365.com/calendar/)
	1. Must import into a personal cal (preferably a new blank cal)
![[attachments/outlook-web import ics file.jpg]]
3. Back to Windows Desktop Outlook, open Calendar in **List View** (View -> Change View > List)
4. Select all (ctrl + a) and copy (ctrl + c)
5. View the empty Group Cal in **List View** (View -> Change View > List)
![[attachments/outlook-empty calendar list before paste.jpg]]
1. paste into blank area (ctrl + p)
2. This may take a while if there is a lot of events being pasted over. 
## Clean up duplicates or accidental import
[Microsoft Word - Removing an imported csv file from Outlook (wtamu.edu)](https://www.wtamu.edu/_files/docs/Removing%20a%20CVS%20File%20from%20my%20Outlook.pdf)

---
## Credits
- [Create a group in Outlook - Microsoft Support](https://support.microsoft.com/en-us/office/create-a-group-in-outlook-04d0c9cf-6864-423c-a380-4fa858f27102)
- [How to Merge Two Outlook Calendars (youtube.com)](https://www.youtube.com/watch?v=i_OXXAhnSus)
- [Export emails, contacts, and calendar items to Outlook using a .pst file - Microsoft Support](https://support.microsoft.com/en-us/office/export-emails-contacts-and-calendar-items-to-outlook-using-a-pst-file-14252b52-3075-4e9b-be4e-ff9ef1068f91)