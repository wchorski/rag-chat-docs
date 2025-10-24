---
dg-publish: true
---
This also works with Windows Server Update Services so you can use this method either connecting to Windows Update (Microsoft Update) or Windows Server Update Services (WSUS).

Now lets get started!

1. Open an Administrative (elevated) command prompt
2. Run “sconfig” to launch the “Server Configuration” application  
    ![command prompt launch sconfig](https://www.stephenwagner.com/wp-content/uploads/2022/01/sconfig-launch.png)
3. Select option “6” to “Download and Install Windows Updates”  
    ![sconfig Server Configuration menu](https://www.stephenwagner.com/wp-content/uploads/2022/01/sconfig-update.png)
4. Choose “A” for all updates, or “R” for recommended updates, and a scan will start
5. After the available updates are shown, choose “A” for all updates, “N” for no updates, or “S” for single update selection

After performing the above, the updates will download and install.

[![sconfig Windows Update running](https://www.stephenwagner.com/wp-content/uploads/2022/01/sconfig-windowsupdate.png)](https://www.stephenwagner.com/wp-content/uploads/2022/01/sconfig-windowsupdate.png)

“sconfig” Windows Update downloading and installing

I find it so much easier to use this method when updating many/multiple servers instead of the GUI. Once the updates are complete and you’re back at the “Server Configuration” application, you can use option “13” to restart Windows.

---
## Credits
- https://www.stephenwagner.com/2022/01/21/windows-server-windows-update-using-cli-command-prompt-and-sconfig/