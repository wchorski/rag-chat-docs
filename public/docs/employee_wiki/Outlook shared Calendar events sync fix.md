---
dg-publish: true
---
> [!quote] Ryne
> I found a problem on two of the admin assistants’ computers today where their shared calendars were not synchronizing new calendar events.  To fix this I followed the below linked procedure to repair their Outlook OST files and this fixed the synchronization issues.

## Symtoms 
-   You receive a message that Outlook can't open your data file
-   You receive a message that Outlook can't open the set of folders
-   You think your Outlook data file may be damaged

## Repair an Outlook data file (.pst) file
1. Exit Outlook and browse to one of the following file locations:
	-   Outlook 2019: `C:\Program Files (x86)\Microsoft Office\root\Office16`
	
1.  Open **SCANPST.EXE**.
    
2.  Select **Browse** to select the Outlook Data File (.pst) you want to scan. If you need help locating your Outlook Data File, see Locating the Outlook Data Files.
    
	- **Note:** By default, a new log file is created during the scan. You can choose **Options** and opt not to have a log created, or you can have the results appended to an existing log file.
    
3.  Choose **Start** to begin the scan.
    
4.  If the scan finds errors, choose **Repair** to start the process to fix them.
	- **Note:** The scan creates a backup file during the repair process. To change the default name or location of this backup file, in the **Enter name of backup file** box, enter a new name, or choose **Browse** to select the file you want to use. You may need to run the tool several times in order to repair your Outlook Data File. In some cases, items may not be recovered if they were permanently deleted or corrupted beyond repair.

---
## Credits
- [Microsoft Support](https://support.microsoft.com/en-us/office/repair-outlook-data-files-pst-and-ost-25663bc3-11ec-4412-86c4-60458afc5253?ui=en-us&rs=en-us&ad=us
- [[L150/tutorials/L150 Tutorials|L150 Tutorials]]