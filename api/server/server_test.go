package server

import (
	"bytes"
	"io/ioutil"
	"net/http/httptest"
	"testing"

	"github.com/aspenjames/blueprint-coding-exercise/api/static"
)

func TestPostDiagnosticScreener(t *testing.T) {
	var tests = []struct {
		body     []byte
		expected []byte
	}{
		{[]byte("{\"answers\":[{\"value\":1,\"question_id\":\"question_a\"},{\"value\":0,\"question_id\":\"question_b\"},{\"value\":2,\"question_id\":\"question_c\"},{\"value\":3,\"question_id\":\"question_d\"},{\"value\":1,\"question_id\":\"question_e\"},{\"value\":0,\"question_id\":\"question_f\"},{\"value\":1,\"question_id\":\"question_g\"},{\"value\":0,\"question_id\":\"question_h\"}]}"),
			[]byte("{\"results\":[\"ASRM\",\"PHQ-9\"]}")},
		{[]byte("{\"answers\":[{\"value\":0,\"question_id\":\"question_a\"},{\"value\":0,\"question_id\":\"question_b\"},{\"value\":0,\"question_id\":\"question_c\"},{\"value\":0,\"question_id\":\"question_d\"},{\"value\":0,\"question_id\":\"question_e\"},{\"value\":0,\"question_id\":\"question_f\"},{\"value\":0,\"question_id\":\"question_g\"},{\"value\":0,\"question_id\":\"question_h\"}]}"),
			[]byte("{\"results\":[]}")},
		{[]byte("{\"answers\":[{\"value\":4,\"question_id\":\"question_a\"},{\"value\":4,\"question_id\":\"question_b\"},{\"value\":4,\"question_id\":\"question_c\"},{\"value\":4,\"question_id\":\"question_d\"},{\"value\":4,\"question_id\":\"question_e\"},{\"value\":4,\"question_id\":\"question_f\"},{\"value\":4,\"question_id\":\"question_g\"},{\"value\":4,\"question_id\":\"question_h\"}]}"),
			[]byte("{\"results\":[\"ASRM\",\"ASSIST\",\"PHQ-9\"]}")},
	}
	domainMap, err := static.ReadDomainMapping("domainMapping.json")
	if err != nil {
		t.Error(err)
	}
	api := InitAPIServer(domainMap)

	for _, test := range tests {
		body := bytes.NewBuffer(test.body)
		req := httptest.NewRequest("POST", "/diagnostic-screener", body)
		req.Header.Set("Accept", "application/json")
		req.Header.Set("Content-type", "application/json")
		resp, err := api.app.Test(req)
		if err != nil {
			t.Error(err)
		}

		respBody, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			t.Error(err)
		}
		if !bytes.Equal(test.expected, respBody) {
			t.Errorf("Expected %s, got %s.", test.expected, respBody)
		}
	}
}
