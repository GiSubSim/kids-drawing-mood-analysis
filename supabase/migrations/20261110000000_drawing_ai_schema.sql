CREATE SCHEMA IF NOT EXISTS "drawing_ai";
GRANT USAGE ON SCHEMA "drawing_ai" TO "anon", "authenticated", "service_role";

CREATE TABLE IF NOT EXISTS "drawing_ai"."analysis_logs" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "persona" text NOT NULL,
    "result_json" jsonb NOT NULL
);

ALTER TABLE "drawing_ai"."analysis_logs" ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE "drawing_ai"."analysis_logs" TO "service_role";
