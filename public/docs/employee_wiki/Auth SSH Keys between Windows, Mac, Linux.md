---
dg-publish: true
tags:
  - cross-platform
  - authentication
  - ssh
---
Set up a SSH server on windows server -> [[L150/tutorials/SSH Server and Keys on Windows 10 Server|SSH Server and Keys on Windows 10 Server]]

```shell
ssh USER@IP

cd .ssh

ssh-keygen

scp id_rsa.pub USER@IP:%programdata%/ssh

cd %programdata%/ssh

type id_rsa.pub >> administrators_authorized_keys

icacls administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

### RDP into Windows Server
1. Open **Notepad** as administrator
2. go to address `%programdata%/ssh`
3. edit file `sshd_config` (you may to to change "show .txt files" to "show all files")
	1. uncomment line `#PubkeyAuthentication yes`
	2. save file (don't close, just minimize)
4. Copy over any other user keys via `scp` to the server
5. in **Notepad** edit file `sshd_config` again
	1. uncomment and edit line `#PasswordAuthentication no`
	2. same to `#PermitEmptyPasswords no `

---
## Credits
- [SSH To Windows Using Public Key (youtube.com)](https://www.youtube.com/watch?v=Wx7WPDnwcDg)