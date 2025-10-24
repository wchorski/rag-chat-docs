---
dg-publish: true
tags:
  - storage
  - RAID
  - windows
  - server
  - configuration
---
1. `f2` on boot to get to **System Configuration**
## Create Virtual Disk for OS
1. System Setup
	1. Device Settings
	2. RAID Controller... Configuration Utility
	3. RAID -> Main Menu -> Configuration Management
		1. Create Virtual Disk
			1. RAID 5
			2. Unconfigured Capacity
			3. Select Physical Disk
				1. Check All "Unconfigured Physical Disks"
				2. Make sure to scroll down (sometimes wheel does not work)
				3. Apply Changes
			4. Virtual Disk Name "ALLDISKS"
			5. Virtual Disk Size (auto populates to max size)
			6. Virtual Disk Size Unit (leave default)
			7. Make sure to scroll down (sometimes wheel does not work)
			8. **Create Virtual Disk**
		2. If above is not possible -> Auto Configure RAID 0
## Install Windows Server
- [[L150/tutorials/Setting Up New Server From Scratch|Setting Up New Server From Scratch]]
## Login to Windows
Now we can get into the OS
3. open app **Server Manager**
4. tab **File and Storage Services**
5. sub tab **Volumes** > **Storage Pools**
6. Look for `TASKS` drop down
	1. `New Storage Pool`
	2. I've named the pool `camera_footage`
	3. confirm all number of drives are present
	4. hit <button>create</button> button
7. **VIRTUAL DISKS** `TASKS` New Virtual Disk...
![[attachments/Pasted image 20240806154258.png]]
	1. Storage Layout = "Simple"
	2. Provisioning = "Fixed"
	3. Size = "Maximum Size"
	4. <button>create</button>
8. Go up to parent tab **Volumes** (virtual disk asked me if i wanted to shortcut right into "create new volume" with checkbox)
	1. `TASKS` - `New Volume...`
	2. Assign to `E:\`
	3. file system = "NTFS"
	4. Volume Label = `camera_footage`

You're good to install [[L150/tutorials/Avigilon Client install and Upgrade|Avigilon Software]] and point storage drive to `E:\`
## Why Not RAID0?
For security cameras we want to utilize the fullest amount of storage and the fastest speed. The camera footage is written continuously so the footage isn't all that important to store for longevity. *BUT* you do not get any fail save if a drive dies out. **RAID5** splits the load across all drives and allows for one drive to go bad, be replaced, and rebuild off of the other drives' parity 
- https://www.hellotech.com/blog/what-is-raid-0-1-5-10#h-what-is-raid-0
## Troubleshooting
I've set it up in a RAID5 on 20TB of disks. There was a 400gb partition that was open (I think one of the NVMe sticks) that I installed Windows on.

The 20TB volume mounted as the `D:\` and I didn't have to create any storage pools or virtual volumes