-- Normalizes existing technical_electives values into table-friendly row objects.
-- Run this in Supabase SQL editor after deploying the app change.
--
-- Before: ["IT101 Human Computer Interaction", "Data Mining"]
-- After:  [{"code": "IT101", "title": "Human Computer Interaction"}, {"code": "", "title": "Data Mining"}]

UPDATE public.prospectus_records AS prospectus
SET technical_electives = normalized.technical_electives
FROM (
  SELECT
    id,
    jsonb_agg(
      CASE
        WHEN jsonb_typeof(elective.value) = 'object' THEN elective.value
        WHEN elective.value #>> '{}' LIKE '%|%'
          THEN jsonb_build_object(
            'code',
            btrim(split_part(elective.value #>> '{}', '|', 1)),
            'title',
            btrim(substr(
              elective.value #>> '{}',
              strpos(elective.value #>> '{}', '|') + 1
            ))
          )
        WHEN elective.value #>> '{}' ~ '^[A-Za-z]{2,}[[:space:]]?[0-9]+[A-Za-z]?[[:space:]]+.+$'
          THEN jsonb_build_object(
            'code',
            btrim(regexp_replace(
              elective.value #>> '{}',
              '^([A-Za-z]{2,}[[:space:]]?[0-9]+[A-Za-z]?)[[:space:]]+(.+)$',
              '\1'
            )),
            'title',
            btrim(regexp_replace(
              elective.value #>> '{}',
              '^([A-Za-z]{2,}[[:space:]]?[0-9]+[A-Za-z]?)[[:space:]]+(.+)$',
              '\2'
            ))
          )
        ELSE jsonb_build_object(
          'code',
          '',
          'title',
          btrim(elective.value #>> '{}')
        )
      END
      ORDER BY elective.ordinality
    ) AS technical_electives
  FROM public.prospectus_records
  CROSS JOIN LATERAL jsonb_array_elements(technical_electives)
    WITH ORDINALITY AS elective(value, ordinality)
  GROUP BY id
) AS normalized
WHERE prospectus.id = normalized.id;
