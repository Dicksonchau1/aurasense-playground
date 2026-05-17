// Audit feature wiring: connects UI to API and WebSocket using strict contracts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api-client';
import { AtlasRehearseSocket } from '../../services/ws/atlas-rehearse-socket';
import { AuditExportRequest, AuditExportRequestSchema, AuditExportResponse, AuditExportResponseSchema } from '../../contracts/audit';
import { AtlasEvent } from '../../contracts/atlas-event';
import { RootState } from '../../app/store';
import { setAuditExportStatus, setAuditError } from '../../domain/audit/auditSlice';

export function useAudit(sessionId: string) {
  const dispatch = useDispatch();
  const auditStatus = useSelector((state: RootState) => state.audit.exportStatus);
  const error = useSelector((state: RootState) => state.audit.error);

  useEffect(() => {
    let socket: AtlasRehearseSocket | null = null;
    // Example: poll or subscribe for audit export status
    api.get(`/audit/export-status/${sessionId}`)
      .then(res => {
        const status: AuditExportResponse = AuditExportResponseSchema.parse(res.data);
        dispatch(setAuditExportStatus(status));
      })
      .catch(e => {
        dispatch(setAuditError('Failed to load audit export status'));
      });
    socket = new AtlasRehearseSocket(sessionId, (event: AtlasEvent) => {
      if (event.type === 'AUDIT_EXPORT_STATUS_UPDATE') {
        try {
          const status: AuditExportResponse = AuditExportResponseSchema.parse(event.payload);
          dispatch(setAuditExportStatus(status));
        } catch {}
      }
      // Add more event handling as needed
    });
    return () => {
      socket?.close();
    };
  }, [sessionId, dispatch]);

  return { auditStatus, error };
}
