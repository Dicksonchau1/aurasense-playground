# Mock MAVLink for test harness (simulates FC responses)
class MockMavlink:
    def send_command(self, cmd, **kwargs):
        return {"ack": 0, "result": "ACCEPTED"}
    def get_status(self):
        return {"armed": False, "mode": "STABILIZE"}
    def get_mag_cal_progress(self):
        return {"COMPASS_1": 100, "COMPASS_2": 100, "COMPASS_3": 100}
    def get_rc_channels(self):
        return {f"CH{i+1}": {"min": 1000, "max": 2000, "trim": 1500, "reversed": False} for i in range(8)}
