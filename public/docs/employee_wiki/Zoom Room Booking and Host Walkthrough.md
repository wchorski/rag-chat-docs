---
tags:
  - walkthrough
  - tutorial
  - Zoom
  - calendar
  - meetings
---
#todo 
- [ ] mute participants (and other mgmt tips)
- [ ] call in number (dial phone)
- [ ] manually dial in meeting ID and passcode
- [ ] how to make room a co-host (no need to start meeting from work laptop)
- [ ] how to default "mute participants upon entry" for all meetings
- [ ] why are meeting subject's auto changing to the Host's name when added to Zoom Room Calendar?
- [ ] Looks like zoom room creates an airplay (but not miracast) connection (that syncs with share button). How do i disable the TV's built in airplay/miracast? (or maybe rename it to something strange like `___`)
- [ ] need screenshots: looks like i can add room as host by typing Room's Name in "Add Zoom" form for cal event
- [ ] adding zoom co-host via the zoom plugin or app
- [ ] how to link calendar with outlook (installing the plugin)
- [ ] how to use access code (people who don't invite room as host)

## Create an Event in Outlook
To start, we making a good old Outlook Calendar Event. We will need 2 things
1. Meeting Title: *test Meeting for chit-Chat Committee*
2. Meeting start and end times: *4:30 PM to 5:00 PM*

Setting a end time is important as it makes sure there is no overlap with double bookings of the room

![[attachments/zoomroom-event-1.png]]

### Add On a Zoom Link
After you have added the [Zoom for Outlook Add-in](https://appsource.microsoft.com/en-us/product/office/WA104381712?src=office&corrid=cd258da5-f6dd-35f4-3cd9-383fd4e1fdc9&omexanonuid=&referralurl=), you should see a **Zoom** button in your toolbar

![[attachments/zoomroom-event-2.png]]

Clicking "Add a Zoom Meeting" will do 2 things

1. Add a zoom link `https://moeits.zoom.us/...` to the **Location** field (this becomes a one click Join button for all invitees)
2. Adds a written instructions to connect to the Zoom in the description of the Event
### Book a Room
Now it's time to book the room you will be using for your event. In the **Location** field, we can add another entry next to the link. 

> [!tip] If you don't know your meeting room's name
> If you don't know the exact name of the meeting room you may type `room` and let the drop down suggest all available rooms to book. From their you can click on your choice

![[attachments/zoomroom-event-3.png]]

In this example we are booking the **MOEITS Conference Room**. This also automatically adds the room as a *Required participant* in the persons field. 

![[attachments/zoomroom-event-4.png]]

### Double Bookings
> [!error] What Just Happened?
> If there is a conflicting event that overlaps your event, the room will reply with an email stating the conflict. 
> 
> This *does not* remove your calendar event, but does serve as a warning that you may have a room mate for your planned meeting that you will need to resolve peer-to-peer.
> 
> ![[attachments/zoomroom-event-5.png]]

> [!success] All Good
> Once you resolve the booking overlap and submit the updated start/end times you will receive an email from the Room resource that everything checks out
![[attachments/zoomroom-event-6.png]]

---
## Add Online Meeting to All Events
For those who always want a virtual option added onto their meetings, you have an option in outlook to do just that. Follow [Microsofts docs](https://support.microsoft.com/en-gb/office/make-every-meeting-online-70f9bda0-fd29-498b-9757-6709cc1c73f0#os_type=windows) to find where to find these settings.

> [!note] Still Need to Book the Room
> You will still need to add the room to your **Location** field upon event creation

![[attachments/zoomroom-event-7.png]]

## Think of a Zoom Room as Another Person
It's best to imagine a Zoom Room as if they are another employee or peer when creating calendar events and deciding permissions. Here are some things to consider and the benefits and drawbacks they come with. 

- Setting the Location properly Invites the Zoom Room as any other participant. The kiosk's schedule will populate with your meeting. 
- Make the Zoom Room a Co-Host if applicable
	- **Pro:** bypass the waiting room at the iPad kiosk. 
	- **Pro:** mediate other participants from the kiosk (admit, mute, kick, etc).
	- **Con:** Anyone with access to the room may start or cancel the meeting from the kiosk. 