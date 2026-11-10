-- 어린이 그림 AI 마음분석 데모용 더미 데이터. 실제 사용자 데이터가 아니다. 다시 실행해도 중복되지 않는다.

INSERT INTO "drawing_ai"."analysis_logs" ("id","persona","result_json") OVERRIDING SYSTEM VALUE VALUES
(1, '마음박사 페페', '{"demo":true,"analysis_result":{"mind_expression":"신나고 편안한 마음","word_cloud":["신나는","편안한","밝은","기분 좋은","포근한"]}}'::jsonb),
(2, '칭찬봇 피코', '{"demo":true,"analysis_result":{"mind_expression":"신나고 편안한 마음","word_cloud":["신나는","편안한","밝은","기분 좋은","포근한"]}}'::jsonb)
ON CONFLICT ("id") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"drawing_ai"."analysis_logs"','id'), (SELECT max("id") FROM "drawing_ai"."analysis_logs"));
