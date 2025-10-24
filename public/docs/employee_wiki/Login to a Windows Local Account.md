---
dg-publish: true
tags:
  - windows
  - authentication
---
When logging into a Windows machine or connecting to a network shared folder, you may see our domain `L150\USERNAME` automatically attached to the username.

To login to a local only account, append `.\` to the beginning of your username. Something like this

```shell
.\USERNAME
```