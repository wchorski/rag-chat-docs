---
dg-publish: true
tags:
  - windows
  - storage
  - data
  - drives
  - managment
---
## It's a bit crowded in here
This file system puts all apps, OS, and data onto one partition. the `C:\` partition. This is not good practice for most server setups

![[attachments/Pasted image 20240815112931.png]]

> [!tip] Shut Down Services
> In my case I am working on an **Avigilon Camera Server**. So I make sure to shut down the app via the **Avigilon Unity Admin Tool**
## I'm SHRINKING!
As we start, there is one crucial thing you should know. The **shrinking process takes time**. Deleting a partition and creating a new one is a lot faster. However, that’s not an option. So make sure to have enough time to complete it.

 Prior to shrinking, you must use the [defrag tool on C Drive](https://www.thewindowsclub.com/disk-defragmenter-windows). It will help to speed up the shrinking process if the there is empty (or previously deleted) space on this drive.

Now that you've set time aside for this project...

1. *Backup* any data assuming you will be deleting a lot of data to make room for the new partition.
2. Delete unwanted data. The disk you are attempting to shrink must show *empty available storage* for **shrink** to work (empty recycle bin too).
3. **Defragment and Optimize Drives** tool to defrag the empty parts
	1. Hit **Optimize** button
4. something about admin command prompt `Chk C: /f`?
	1. This will ask you to reboot (because the "program will run on next boot")
6. RDP back into server and reboot again
7. Go to the **Disk Management** tool, right click the `C:` partition, and hit `Shrink Volume...`

![[attachments/Pasted image 20240820105633.png]]

## No available shrink space
When going to shrink you may be greeted with a fat `0` amount of space. Meaning there is no space left to shrink to.

![[attachments/Pasted image 20240827131217.png]]

There are a few steps you can take in no particular order that you can try.
### 1. Event Viewer
Windows Logs -> Application

filter for `Defrag` events
![[attachments/Pasted image 20240827131628.png]]

In this case it's `pagefile.sys` that is locking the storage
![[attachments/Pasted image 20240827131706.png]]

### 2. Search and Destroy 
Now we will look for `pagefile.sys` (the file you're looking for maybe different)

Make sure to show hidden files
![[attachments/Pasted image 20240827131816.png]]

1. check "Show hidden files"
2. check "Hide protected operating system files"
![[attachments/Pasted image 20240827131906.png]]

---
## Credit
- [How to Partition C drive in Windows 11/10 without formatting (thewindowsclub.com)](https://www.thewindowsclub.com/partition-c-drive-in-windows-10-without-formatting#:~:text=You%20can%20partition%20C%20drive%20in%20Windows%2011%2F10,%26%20create%20a%20new%20partition%20out%20of%20it.)
- [Geek4Tutorial.com: How to create new partition from C: drive in windows 10 without formatting](https://www.geek4tutorial.com/2021/03/how-to-create-new-partition-from-c.html)