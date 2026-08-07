import paramiko
import os
import sys

host = "13.140.160.248"
user = "root"
password = "botseo_vps"
local = r"C:\MatuStudio\AppRUI-deploy.tgz"
remote = "/root/AppRUI-deploy.tgz"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, username=user, password=password, timeout=20)
sftp = ssh.open_sftp()
print(f"Uploading {local} -> {remote} ({os.path.getsize(local)} bytes)...")
sftp.put(local, remote)
sftp.close()
print("Upload done")

cmds = [
    "mkdir -p /root/apps && cd /root/apps && rm -rf AppRUI && tar -xzf /root/AppRUI-deploy.tgz && ls -la AppRUI | head",
    "cd /root/apps/AppRUI && chmod +x deploy.sh && ./deploy.sh --setup",
]

for c in cmds:
    print(f"\n$ {c}")
    stdin, stdout, stderr = ssh.exec_command(c, timeout=600, get_pty=True)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    print(out)
    if err.strip():
        print("STDERR:", err)
    code = stdout.channel.recv_exit_status()
    print("exit:", code)
    if code != 0:
        ssh.close()
        sys.exit(code)

ssh.close()
print("OK setup finished")
