package com.kaamwalapakistan.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Button;
import android.graphics.Color;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    private RelativeLayout errorLayout;
    
    // The Kaam Wala Pakistan Live Production & Development Host
    // Default fallback points to the live app
    private static final String APP_URL = "https://ais-pre-hcxkncfvr5ynhfxitnza7p-901070973762.asia-southeast1.run.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Container Layout
        RelativeLayout rootLayout = new RelativeLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#f8fafc"));

        // WebView
        webView = new WebView(this);
        RelativeLayout.LayoutParams webParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        );
        webView.setLayoutParams(webParams);

        // WebSettings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " KaamWalaApp/1.0.0 (Android)");

        // Horizontal Progress Bar
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        RelativeLayout.LayoutParams progressParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            8
        );
        progressParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        progressBar.setLayoutParams(progressParams);
        progressBar.setMax(100);

        // Offline / Error Layout
        errorLayout = new RelativeLayout(this);
        RelativeLayout.LayoutParams errorParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        );
        errorLayout.setLayoutParams(errorParams);
        errorLayout.setBackgroundColor(Color.WHITE);
        errorLayout.setVisibility(View.GONE);

        TextView errorText = new TextView(this);
        errorText.setText("Unable to connect to Kaam Wala Pakistan.\nPlease check your mobile internet or Wi-Fi connection.");
        errorText.setTextSize(14);
        errorText.setTextColor(Color.parseColor("#334155"));
        errorText.setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
        RelativeLayout.LayoutParams textParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        textParams.addRule(RelativeLayout.CENTER_IN_PARENT);
        errorText.setLayoutParams(textParams);
        errorText.setId(101);

        Button retryBtn = new Button(this);
        retryBtn.setText("Retry Connection");
        retryBtn.setBackgroundColor(Color.parseColor("#0d9488"));
        retryBtn.setTextColor(Color.WHITE);
        RelativeLayout.LayoutParams btnParams = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        btnParams.addRule(RelativeLayout.BELOW, 101);
        btnParams.addRule(RelativeLayout.CENTER_HORIZONTAL);
        btnParams.topMargin = 30;
        retryBtn.setLayoutParams(btnParams);
        retryBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                errorLayout.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                webView.reload();
            }
        });

        errorLayout.addView(errorText);
        errorLayout.addView(retryBtn);

        // WebView Client
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("tel:")) {
                    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } else if (url.startsWith("whatsapp:") || url.contains("wa.me") || url.contains("api.whatsapp.com")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                    } catch (Exception e) {
                        view.loadUrl(url);
                    }
                    return true;
                } else if (url.startsWith("mailto:")) {
                    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } else if (!url.contains("run.app") && !url.contains("localhost") && !url.startsWith("file:///")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                errorLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                webView.setVisibility(View.GONE);
                errorLayout.setVisibility(View.VISIBLE);
            }
        });

        // WebChromeClient
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }
        });

        rootLayout.addView(webView);
        rootLayout.addView(progressBar);
        rootLayout.addView(errorLayout);

        setContentView(rootLayout);

        // Load Application
        webView.loadUrl(APP_URL);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
