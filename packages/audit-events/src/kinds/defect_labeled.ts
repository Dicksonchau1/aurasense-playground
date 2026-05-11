export interface DefectLabeledEvent {
  kind: "defect_labeled";
  defect_id: string;
  label: "new" | "pre_existing" | "false_positive";
  labeled_by: string;
  prior_quarter_match?: string;
  ts: string;
}export interface DefectLabeledEvent {
  kind: "defect_labeled";
  defect_id: string;
  label: "new" | "pre_existing" | "false_positive";
  labeled_by: string;
  prior_quarter_match?: string;
  ts: string;
}
